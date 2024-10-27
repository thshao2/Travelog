package backend.auth_service.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.auth_service.dto.Token;
import backend.auth_service.dto.ValidateTokenResponse;
import backend.auth_service.entity.User;
import backend.auth_service.exception.DuplicateCredentialsException;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;
import backend.auth_service.service.JwtService;
import io.jsonwebtoken.JwtException;




@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired   
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup") // handles post reqs to /auth/signup
    public ResponseEntity<String> signup(@RequestBody User user) {
      System.out.println("POST /auth/signup hit");
        try {
            // save in auth db
            authService.saveUser(user);
            // populate dto for sending to user db
            // SetUserProfile userProfile = new SetUserProfile();
            // userProfile.setUserId(user.getId());
            // userProfile.setBio(null);
            // userProfile.setAvatarMediaId(null);
            // userProfile.setJointedAt(LocalDate.now());
            
            // sendUserProfileToUserService(userProfile);
            // System.out.println("here");
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (DuplicateCredentialsException e) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body("User with email is already registered with us");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while registering the user");
        }
    }

    // private void sendUserProfileToUserService(SetUserProfile userProfile) {
    //   RestTemplate restTemplate = new RestTemplate();
    //   try {
    //       ResponseEntity<Void> response = restTemplate.postForEntity("http://localhost:8080/user/createProfile", userProfile, Void.class);
    //       if (response.getStatusCode() != HttpStatus.OK) {
    //           // Handle error appropriately
    //           System.err.println("Failed to send user profile to user service: " + response.getStatusCode());
    //       }
    //   } catch (Exception e) {
    //       // Handle connection errors, etc.
    //       System.err.println("Error sending user profile to user service: " + e.getMessage());
    //   }
    // }

    @PostMapping("/login")
    public ResponseEntity<Object> logIn(@RequestBody User user) {
        System.out.println("Inside login");
        // return ResponseEntity.ok("Auth Service is running with login");
        try {
            // Attempt to generate a JWT token based on the credentials
            String token = authService.logIn(user);
            return ResponseEntity.ok(new Token(token));
        } catch (InvalidCredentialsException e) {
            // Handle invalid credentials exception
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<Object> validateToken(@RequestParam String token) {
        System.out.println("Inside validate-token");
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

    @GetMapping("/user")
    public ResponseEntity<Object> getUser(@RequestParam Long userId) {
        System.out.println("GET /auth/user endpoint hit");
        try {
            Optional<User> user = userRepository.findById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the user");
        }
    }
}
