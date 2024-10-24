package backend.gateway.config;

/**
 * Source: https://github.com/Java-Techie-jt/jwt-apigateway-security/blob/main/swiggy-gateway/src/main/java/com/javatechie/config/AppConfig.java
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate template(){
       return new RestTemplate();
    }
}