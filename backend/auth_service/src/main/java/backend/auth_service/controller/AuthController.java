package backend.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.auth_service.service.AuthService;
import backend.auth_service.dto.LogInResponse;
import backend.auth_service.entity.User;
import backend.auth_service.exception.InvalidCredentialsException;

import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:8082")
@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired   
    private AuthService authService;

    // @PostMapping("/signUp")
    // public String signUp(@RequestBody User user) {
    //     return authService.saveUser(user);
    // }

    @PostMapping("/login")
    public ResponseEntity<Object> logIn(@RequestBody User user) {
        System.out.println("Inside login");
        try {
            // Attempt to generate a JWT token based on the credentials
            String token = authService.logIn(user);
            return ResponseEntity.ok(new LogInResponse(token));
        } catch (InvalidCredentialsException e) {
            // Handle invalid credentials exception
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @GetMapping
    public ResponseEntity<String> getAuth() {
        System.out.println("GET /auth endpoint hit");
        return ResponseEntity.ok("Auth Service is running");
    }
}
