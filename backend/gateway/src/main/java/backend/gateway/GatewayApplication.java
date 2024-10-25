package backend.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;

import backend.gateway.filter.AuthFilter;

@SpringBootApplication
public class GatewayApplication {
    // Registers the global filter as a Bean so it is ran
    @Bean
    public GlobalFilter requestFilter() {
        return new AuthFilter();
    }

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
