// package backend.auth_service.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**")
//                         .allowedOrigins("http://localhost:8081") // Add your frontend URL here
//                         .allowedMethods("GET", "POST", "PUT", "DELETE") // Add other HTTP methods as needed
//                         .allowedHeaders("*")  // Allow any headers
//                         .allowCredentials(true);  // Enable if credentials like cookies need to be shared
//             }
//         };
//     }
// }

// package backend.gateway.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.CorsWebFilter;
// import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public CorsWebFilter corsFilter() {
//         CorsConfiguration config = new CorsConfiguration();
//         config.addAllowedOrigin("http://localhost:8081"); // React Native client origin
//         config.addAllowedMethod("*");
//         config.addAllowedHeader("*");
//         config.setAllowCredentials(true);

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);

//         return new CorsWebFilter(source);
//     }
// }
