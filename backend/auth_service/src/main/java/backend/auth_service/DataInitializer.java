package backend.auth_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Encode the password
        String hashedPassword = passwordEncoder.encode("travelog");
        String hashedPassword2 = passwordEncoder.encode("mollymember");
        String hashedPassword3 = passwordEncoder.encode("annaadmin");

        // Insert the dummy user with hashed password
        jdbcTemplate.update(
                "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                "travelog",
                hashedPassword,
                "travelog@gmail.com");
        jdbcTemplate.update(
                "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                "Molly Member",
                hashedPassword2,
                "molly@gmail.com");
        jdbcTemplate.update(
                "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                "Anna Admin",
                hashedPassword3,
                "anna@gmail.com");

        System.out.println("Dummy data initialized with hashed password.");
    }
}
