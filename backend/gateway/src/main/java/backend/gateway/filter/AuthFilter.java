package backend.gateway.filter;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Mono;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.reactive.function.client.WebClient;
import backend.gateway.config.AuthConfig;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.web.client.RestTemplate;
import backend.gateway.dto.ValidateTokenResponse;
import org.springframework.web.client.HttpClientErrorException;


public class AuthFilter implements GlobalFilter, Ordered {

    // Contains a list of paths that should be unauthenticated
    @Autowired
    private AuthConfig authConfig;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Get request object
        ServerHttpRequest request = exchange.getRequest();

        // Get request path and return immediate if path should be unauthenticated
        String path = request.getPath().toString();
        if (authConfig.getExcludedPaths().contains(path)) {
            System.out.println(path + " should not be authenticated - skipping filter.");
            return chain.filter(exchange);
        }

        // Get Authorization header & sanity check
        String authorizationHeader = request.getHeaders().getFirst("Authorization");
        System.out.println("Authorization header is" + authorizationHeader);
        if (authorizationHeader == null) {
            return handleError(exchange, "Unauthorized - no authorization header provided");
        }

        // Extract JWT Token from Header & More Error Checking
        String[] authHeaderSplit = authorizationHeader.split("[ ]");
        if (authHeaderSplit.length != 2 || !authHeaderSplit[0].equals("Bearer")) {
            return handleError(exchange, "Unauthorized - incorrect format for auth header");
        }
        String token = authHeaderSplit[1];

        // Verify JWT Token by Calling Auth Service
        ValidateTokenResponse response;
        try {
            response = restTemplate.getForObject(
                "http://auth-service:3010/auth/validate-token?token=" + token, 
                ValidateTokenResponse.class
            );
        } catch (HttpClientErrorException e) {
            // Handle client error response (4xx)
            return handleError(exchange, e.getResponseBodyAsString(), HttpStatus.valueOf(e.getStatusCode().value()));
        } catch (Exception e) {
            // Handle other exceptions
            return handleError(exchange, "Error validating token: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Extract userId from response
        Long userId = response != null ? response.getUserId() : null;

        // Attach UserId to header (if relavant)
        // If userId is present, attach it to the request header
        if (userId != null) {
            exchange.getResponse().getHeaders().add("X-User-Id", String.valueOf(userId));
        } else {
            return handleError(exchange, "Unauthorized - token validation failed");
        }
        return chain.filter(exchange);
    }


    // private Mono<Void> handleError(ServerWebExchange exchange, String errorMessage) {
    //     // Access response object to modify status and body
    //     ServerHttpResponse response = exchange.getResponse();
        
    //     // Set HTTP status code 
    //     response.setStatusCode(HttpStatus.UNAUTHORIZED);
        
    //     // Prepare custom error message in response body
    //     byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
    //     response.getHeaders().setContentType(MediaType.TEXT_PLAIN);
        
    //     // Write the custom error message in response body
    //     return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    // }


    /**
     * Default method - if no status code is passed in, it's unauthorized
     */
    private Mono<Void> handleError(ServerWebExchange exchange, String errorMessage) {
        
        return handleError(exchange, errorMessage, HttpStatus.UNAUTHORIZED);
    }

    private Mono<Void> handleError(ServerWebExchange exchange, String errorMessage, HttpStatus status) {
        // Access response object to modify status and body
        ServerHttpResponse response = exchange.getResponse();

        // Set HTTP status code 
        response.setStatusCode(status);

        // Prepare custom error message in response body
        byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
        response.getHeaders().setContentType(MediaType.TEXT_PLAIN);

        // Write the custom error message in response body
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }

    @Override
    public int getOrder() {
        return -2;
    }
}