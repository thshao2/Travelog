package travelog_backend.auth_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import backend.auth_service.entity.User;
import backend.auth_service.exception.DuplicateCredentialsException;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;
import backend.auth_service.service.JwtService;

public class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("password123");
    }

    @Test
    void testFetchUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertNotNull(user);
        assertEquals(user.getEmail(), "test@example.com");
        assertEquals(user.getPassword(), "password123");
        System.out.println("Passed test fetch user"); // check debug console
    }

    @Test
    void testValidatePassword_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", user.getPassword())).thenReturn(true);
        boolean result = authService.validatePassword(user, "password123");
        assertEquals(true, result);
        System.out.println("Passed test validate password"); // check debug console
    }

    @Test
    void testValidatePassword_Failure() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", user.getPassword())).thenReturn(false);
        boolean result = authService.validatePassword(user, "not correct password");
        assertEquals(false, result);
        System.out.println("Passed test validate password failure"); // check debug console
    }

    @Test
    void testUpdatePassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedPassword");
        authService.updateUserPassword(user, "newPassword");
        assertEquals("encodedPassword", user.getPassword());
        System.out.println("Passed test update password"); // check debug console
    }

    @Test
    void testSaveUser_Success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");

        String result = authService.saveUser(user);

        assertEquals("Added user to the system", result); // make sure it returns same str
        verify(userRepository, times(1)).save(user);
        assertEquals("encodedPassword", user.getPassword());
        assertNotNull(user.getId());
        System.out.println("test save user success"); // check debug console
    }

    @Test
    void testSaveUser_DuplicateEmail() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        assertThrows(DuplicateCredentialsException.class, () -> {
            authService.saveUser(user);
        });

        verify(userRepository, times(0)).save(user);
        System.out.println("test save user duplicate email"); // check debug console
    }

    @Test
    void testLogIn_Success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user.getId())).thenReturn("jwt-token");

        String token = authService.logIn(user);

        assertEquals("jwt-token", token);
        System.out.println("test log in success"); // check debug console
    }

    @Test
    void testLogIn_InvalidCredentials() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", user.getPassword())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.logIn(user);
        });

        System.out.println("test log in invalid credentials"); // check debug console
    }

    @Test
    void testUpdateUser_Success() {
        User updatedUser = new User();
        updatedUser.setUsername("newUsername");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = authService.updateUser(Optional.of(user), updatedUser);

        assertEquals("newUsername", result.getUsername());
        verify(userRepository, times(1)).save(user);
        System.out.println("test update user success"); // check debug console
    }

    @Test
    void testUpdateUser_UserNotFound() {
        User updatedUser = new User();
        updatedUser.setUsername("newUsername");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.updateUser(Optional.empty(), updatedUser);
        });

        verify(userRepository, times(0)).save(user);
        System.out.println("test update user user not found"); // check debug console
    }

    @Test
    void testCheckDuplicateEmails() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        boolean result = authService.checkDuplicateEmails(user.getEmail());

        assertEquals(true, result);
        System.out.println("test check duplicate emails"); // check debug console
    }

    @Test
    void testCheckDuplicateEmails_NoDuplicate() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        boolean result = authService.checkDuplicateEmails(user.getEmail());

        assertEquals(false, result);
        System.out.println("test check duplicate emails no duplicate"); // check debug console
    }
}
