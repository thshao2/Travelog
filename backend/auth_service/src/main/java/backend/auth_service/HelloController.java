package backend.auth_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@RestController
public class HelloController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @GetMapping("/auth-db-test")
    public String testConnection() {
        try {
            // Execute a simple query to test the connection
            List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT * FROM account LIMIT 1");
            return "Connection successful! Retrieved data: " + result.toString();
        } catch (Exception e) {
            return "Connection failed: " + e.getMessage();
        }
    }
}