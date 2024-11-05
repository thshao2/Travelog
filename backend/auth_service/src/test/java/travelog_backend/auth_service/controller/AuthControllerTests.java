package travelog_backend.auth_service.controller;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.auth_service.TestApplication;
import backend.auth_service.controller.AuthController;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;
import backend.auth_service.service.JwtService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // disable security for testing
@ContextConfiguration(
        classes = TestApplication.class,
        locations = "backend.auth_service") // need spring context config for testing
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        objectMapper = new ObjectMapper(); // // json format for making api requests
    }

    // @Test
}
