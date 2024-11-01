package travelog_backend.auth_service.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.auth_service.controller.AuthController;
import backend.auth_service.repository.UserRepository;
import backend.auth_service.service.AuthService;
import backend.auth_service.service.JwtService;
import backend.auth_service.TestApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // disable security for testing
@ContextConfiguration(classes = TestApplication.class, locations = "backend.auth_service") // need spring context config for testing 
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