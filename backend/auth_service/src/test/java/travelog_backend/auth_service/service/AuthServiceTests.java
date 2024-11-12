package travelog_backend.auth_service.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import backend.auth_service.entity.User;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;

public class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

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
    void testFetchUser_Sucess() {
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
   

    
}
