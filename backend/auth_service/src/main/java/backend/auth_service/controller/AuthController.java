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
import backend.auth_service.service.JwtService;
import io.jsonwebtoken.JwtException;
import backend.auth_service.dto.Token;
import backend.auth_service.dto.ValidateTokenResponse;
import backend.auth_service.entity.User;
import backend.auth_service.exception.InvalidCredentialsException;

import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired   
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    // @PostMapping("/signUp")
    // public String signUp(@RequestBody User user) {
    //     return authService.saveUser(user);
    // }

    @PostMapping("/login")
    public ResponseEntity<Object> logIn(@RequestBody User user) {
        System.out.println("Inside login");
        return ResponseEntity.ok("Auth Service is running with login");
        // try {
        //     // Attempt to generate a JWT token based on the credentials
        //     String token = authService.logIn(user);
        //     return ResponseEntity.ok(new Token(token));
        // } catch (InvalidCredentialsException e) {
        //     // Handle invalid credentials exception
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        // } catch (Exception e) {
        //     // Handle other exceptions
        //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        // }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Object> validateToken(@RequestBody Token tokenReq) {
        System.out.println("Inside validate-token");
        String token = tokenReq.getToken();
        try {
            Long userId = jwtService.validateToken(token);
            return ResponseEntity.ok(new ValidateTokenResponse(userId));
        } catch (JwtException e) { // JWT decoding or validation failure
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (Exception e) { // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @GetMapping
    public ResponseEntity<String> getAuth() {
        System.out.println("GET /auth endpoint hit");
        return ResponseEntity.ok("Auth Service is running");
    }
}
