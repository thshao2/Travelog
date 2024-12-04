package travelog_backend.auth_service.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.auth_service.TestApplication;
import backend.auth_service.controller.AuthController;
import backend.auth_service.dto.UpdatePasswordRequest;
import backend.auth_service.entity.User;
import backend.auth_service.exception.DuplicateCredentialsException;
import backend.auth_service.exception.InvalidCredentialsException;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;
import backend.auth_service.service.JwtService;
import io.jsonwebtoken.JwtException;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // disable security for testing
@ContextConfiguration(classes = {TestApplication.class, AuthService.class}) // need spring context config for testing
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RestTemplate restTemplate;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper(); // json format for making api requests
    }

    @Test
    public void testSignup_DuplicateEmail() throws Exception {
        User user = new User(1L, "testuser", "password", "test@example.com");

        when(authService.saveUser(any(User.class)))
                .thenThrow(new DuplicateCredentialsException("User with email is already registered with us"));

        mockMvc.perform(post("/auth/signup")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$").value("User with email is already registered with us"));

        System.out.println("Passed testSignup_DuplicateEmail");
    }

    @Test
    public void testGetUser_Success() throws Exception {
        User user = new User(1L, "testuser", "password", "test@example.com");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        mockMvc.perform(get("/auth/user").param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        System.out.println("Passed testGetUser_Success");
    }

    @Test
    public void testGetUser_UserNotFound() throws Exception {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/auth/user").param("userId", "1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("User not found"));

        System.out.println("Passed testGetUser_UserNotFound");
    }

    @Test
    public void testGetUser_Exception() throws Exception {
        when(userRepository.findById(anyLong())).thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/auth/user").param("userId", "1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$").value("An error occurred while fetching the user"));

        System.out.println("Passed testGetUser_Exception");
    }

    @Test
    public void testLogin_Success() throws Exception {
        User user = new User(1L, "testuser", "password", "test@example.com");

        when(authService.logIn(user)).thenReturn("jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));

        System.out.println("Passed testLogin_Success");
    }

    @Test
    public void testLogin_InvalidCredentials() throws Exception {
        User user = new User(1L, "testuser", "wrongpassword", "test@example.com");

        when(authService.logIn(user)).thenThrow(new InvalidCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("Invalid credentials"));

        System.out.println("Passed testLogin_InvalidCredentials");
    }

    @Test
    public void testUpdateUserPassword_Success() throws Exception {
        User user = new User(1L, "testuser", "password", "test@example.com");
        UpdatePasswordRequest updatePasswordRequest = new UpdatePasswordRequest("password", "newPassword");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(authService.validatePassword(user, "password")).thenReturn(true);
        when(authService.updateUserPassword(user, "newPassword")).thenReturn(user);

        mockMvc.perform(put("/auth/update-password")
                        .header("X-User-Id", "1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updatePasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        System.out.println("Passed testUpdateUserPassword_Success");
    }

    @Test
    public void testUpdateUserPassword_InvalidCurrentPassword() throws Exception {
        User user = new User(1L, "testuser", "password", "test@example.com");
        UpdatePasswordRequest updatePasswordRequest = new UpdatePasswordRequest("wrongpassword", "newPassword");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(authService.validatePassword(user, "wrongpassword")).thenReturn(false);

        mockMvc.perform(put("/auth/update-password")
                        .header("X-User-Id", "1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updatePasswordRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("Invalid current password"));

        System.out.println("Passed testUpdateUserPassword_InvalidCurrentPassword");
    }

    @Test
    public void testValidateToken_Success() throws Exception {
        when(jwtService.validateToken(anyString())).thenReturn(1L);

        mockMvc.perform(get("/auth/validate-token").param("token", "jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1L));

        System.out.println("Passed testValidateToken_Success");
    }

    @Test
    public void testValidateToken_InvalidToken() throws Exception {
        when(jwtService.validateToken(anyString())).thenThrow(new JwtException("Invalid token"));

        mockMvc.perform(get("/auth/validate-token").param("token", "invalid-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("Invalid or expired token"));

        System.out.println("Passed testValidateToken_InvalidToken");
    }

    @Test
    public void testValidateToken_Exception() throws Exception {
        when(jwtService.validateToken(anyString())).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/auth/validate-token").param("token", "jwt-token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$").value("An unexpected error occurred"));

        System.out.println("Passed testValidateToken_Exception");
    }
}
