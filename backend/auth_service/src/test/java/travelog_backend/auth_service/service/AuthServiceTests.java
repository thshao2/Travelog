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
    void testSaveUser_Success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");

        String result = authService.saveUser(user);

        assertEquals("Added user to the system", result); // make sure it returns same str
        verify(userRepository, times(1)).save(user);
        assertEquals("encodedPassword", user.getPassword());
        assertNotNull(user.getId());
        System.out.println("HERE"); // check debug console
    }
   

    // @Test

    
}
