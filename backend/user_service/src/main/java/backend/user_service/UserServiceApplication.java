package backend.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        // Dotenv dotenv = Dotenv.configure().load();
        // System.setProperty("AWS_ACCESS_KEY_ID", dotenv.get("AWS_ACCESS_KEY_ID"));
        // System.setProperty("AWS_SECRET_ACCESS_KEY", dotenv.get("AWS_SECRET_ACCESS_KEY"));
        // System.setProperty("AWS_REGION", dotenv.get("AWS_REGION"));
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
