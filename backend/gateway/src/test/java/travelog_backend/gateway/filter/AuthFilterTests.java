package travelog_backend.gateway.filter;

import static org.junit.jupiter.api.Assertions.*; // 
import static org.mockito.ArgumentMatchers.*; // 
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders; // 
import org.springframework.http.HttpStatus; // 
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import backend.gateway.config.AuthConfig;
import backend.gateway.dto.ValidateTokenResponse;
import reactor.core.publisher.Mono;
import backend.gateway.filter.AuthFilter;

public class AuthFilterTests {
    @InjectMocks
    private AuthFilter authFilter;

    @Mock
    private AuthConfig authConfig;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ServerWebExchange exchange;

    @Mock
    private ServerHttpRequest request;

    @Mock
    private ServerHttpResponse response;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(exchange.getRequest()).thenReturn(request);
        when(exchange.getResponse()).thenReturn(response);
    }

    // @Test

}
