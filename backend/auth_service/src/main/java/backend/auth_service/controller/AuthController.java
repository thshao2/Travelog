package backend.auth_service.controller;

import java.util.Optional;
import java.time.LocalDate;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.auth_service.dto.Token;
import backend.auth_service.dto.SetUserProfile;
import backend.auth_service.dto.ValidateTokenResponse;
import backend.auth_service.entity.User;
import backend.auth_service.exception.DuplicateCredentialsException;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.exception.UserProfileCreationException;
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
            SetUserProfile userProfile = new SetUserProfile();
            userProfile.setUserId(user.getId());
            userProfile.setBio(null);
            userProfile.setAvatarMediaId(null);
            userProfile.setJointedAt(LocalDate.now());

            // sendUserProfileToUserService(userProfile);
            System.out.println("SUCCESSFULLY CREATED ACCOUNT");
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (DuplicateCredentialsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with email is already registered with us");
        } catch (UserProfileCreationException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Failed to create user profile in user service");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while registering the user");
        }
    }

    // private void sendUserProfileToUserService(SetUserProfile userProfile) {
    //   RestTemplate restTemplate = new RestTemplate();
    //   try {
    //       ResponseEntity<Void> response = restTemplate.postForEntity("http://user-service:3010/user/createProfile",
    // userProfile, Void.class);
    //       if (response.getStatusCode() != HttpStatus.OK) {
    //           // Handle error appropriately
    //           throw new UserProfileCreationException("Failed to send user profile to user service: " + response.getStatusCode());
    //         }
    //   } catch (Exception e) {
    //       throw new UserProfileCreationException("Error sending user profile to user service: " + e.getMessage());
          
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
        System.out.println("GET /auth/user endpoint hit with userId: " + userId);
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                System.out.println("User found: " + user.get());
                return ResponseEntity.ok(user.get());
            } else {
                System.out.println("User not found with userId: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            System.err.println("An error occurred while fetching the user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching the user");
        }
    }

    @PutMapping("/user/update")
    public ResponseEntity<Object> updateUser(@RequestBody User user) {
        System.out.println("PUT /auth/user/update endpoint hit with userId: " + user.getId());
        try {
            Optional<User> existingUser = userRepository.findById(user.getId());
            if (existingUser.isPresent()) {
                User updatedUser = authService.updateUser(existingUser, user);
                System.out.println("User updated: " + updatedUser);
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            System.err.println("An error occurred while updating the user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the user");
        }
    }

    @PutMapping("/user/update-password")
    public ResponseEntity<Object> updateUserPassword(@RequestHeader("X-User-Id") Long userId, @RequestBody String currentPassword, @RequestBody String newPassword) {
        System.out.println("PUT /auth/user/update-password endpoint hit with userId: " + userId);
        try {
            Optional<User> existingUser = userRepository.findById(userId);
            if (existingUser.isPresent()) {
                if (!authService.validatePassword(existingUser.get(), currentPassword)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password");
                }
                User updatedUser = authService.updateUserPassword(existingUser, newPassword);
                System.out.println("User password updated: " + updatedUser);
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            System.err.println("An error occurred while updating the user password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the user password");
        }
    }
}
