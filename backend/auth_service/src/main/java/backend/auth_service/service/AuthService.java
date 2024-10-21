package backend.auth_service.service;

import backend.auth_service.entity.User;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
  @Autowired
  private UserRepository repository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtService jwtService;

  // Saves user into the repository (used for signup).
  // public String saveUser(User userCredential) {
  //   // Take raw password and encode it.
  //   userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));
  //   repository.save(userCredential);
  //   return "Added user to the system";
  // }

  // Log in by verifying credentials & issuing a jwt.
  public String logIn(User userCredential) {
    Optional<Long> userId = validateLoginCredentials(userCredential);
    if (userId.isPresent()) {
      return jwtService.generateToken(userId.get());
    } else {
      throw new InvalidCredentialsException("Invalid username or password");
    }
  }

  // Validate username and password.
  private Optional<Long> validateLoginCredentials(User userCredential) {
    // Gather username and password from the request.
    String inputUsername = userCredential.getUsername();
    String inputPassword = userCredential.getPassword();

    // Fetch user based on username
    Optional<User> userEntry = repository.findByUsername(inputUsername);
    // User exists - now verify their password.
    if (userEntry.isPresent()) {
      User user = userEntry.get();
      String expectedHashedPassword = user.getPassword();

      // Password matches - return user ID.
      if (passwordEncoder.matches(inputPassword, expectedHashedPassword)) {
        return Optional.of(user.getId());
      }
    }
    return Optional.empty();
  }

  // // Validate JWT Token to get User ID.
  // public Long validateToken(String token) {
  //   return jwtService.validateToken(token);
  // }
}
