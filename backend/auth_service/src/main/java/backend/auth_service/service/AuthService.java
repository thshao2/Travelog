package backend.auth_service.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.auth_service.entity.User;
import backend.auth_service.exception.DuplicateCredentialsException;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String saveUser(User userCredential) {
        // check for duplicate email:
        if (checkDuplicateEmails(userCredential.getEmail())) {
            throw new DuplicateCredentialsException("Email is already in use");
        }
        // Take raw password and encode it.
        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));
        repository.save(userCredential);
        return "Added user to the system";
    }
    // checking for duplicate email addresses:
    public boolean checkDuplicateEmails(String userEmail) {
        return repository.findByEmail(userEmail).isPresent();
    }

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
        System.out.println(userCredential);
        // Gather username and password from the request.
        String inputEmail = userCredential.getEmail();
        String inputPassword = userCredential.getPassword();

        // Fetch user based on email
        Optional<User> userEntry = repository.findByEmail(inputEmail);
        System.out.println("userEntry " + userEntry);
        // User exists - now verify their password.
        if (userEntry.isPresent()) {
            System.out.println("userEntry is present");
            User user = userEntry.get();
            String expectedHashedPassword = user.getPassword();

            // Password matches - return user ID.
            System.out.println("inputPassword: " + inputPassword);
            System.out.println("expectedHashedPassword: " + expectedHashedPassword);
            if (passwordEncoder.matches(inputPassword, expectedHashedPassword)) {
                System.out.println("password matches");
                return Optional.of(user.getId());
            }
        }
        return Optional.empty();
    }

    // // Validate JWT Token to get User ID.
    // public Long validateToken(String token) {
    //   return jwtService.validateToken(token);
    // }

    public User updateUser(Optional<User> existingUser, User user) {
        if (!existingUser.isPresent()) {
            throw new InvalidCredentialsException("User not found");
        }
        User userToUpdate = existingUser.get();
        userToUpdate.setUsername(user.getUsername());
        userToUpdate.setEmail(user.getEmail());
        return repository.save(userToUpdate);
    }

    public User updateUserPassword(User existingUser, String password) {
        System.out.println("Updating user password: " + password);
        // update user password
        if (password != null) {
            existingUser.setPassword(passwordEncoder.encode(password));
        }
        System.out.println("Updated user password: " + existingUser.getPassword());
        repository.save(existingUser);
        return existingUser;
    }

    public Boolean validatePassword(User existingUser, String password) {
        System.out.println("Verifying user password: " + password);
        // verify user password
        if (password != null) {
            if (passwordEncoder.matches(password, existingUser.getPassword())) {
                System.out.println("Password matches");
                return true;
            }
        }
        System.out.println("Password does not match");
        return false;
    }
}
