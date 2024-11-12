package travelog_backend.user_service.controller;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.web.client.RestTemplate;

import backend.user_service.TestApplication;
import backend.user_service.controller.UserController;
import backend.user_service.dto.UserDTO;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import backend.user_service.service.UserService;
import software.amazon.awssdk.services.s3.S3Client;

@WebMvcTest(controllers = UserController.class)
@ContextConfiguration(classes = { TestApplication.class, UserService.class })
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileRepository userProfileRepository;

    @MockBean
    private RestTemplate restTemplate;

    @MockBean
    private S3Client s3Client;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetCurrentUserProfile_Success() throws Exception {
        UserProfile userProfile = new UserProfile(1L, 1L, "test@example.com", "testuser", "Test bio", "https://example.com/avatar.jpg", LocalDate.now(), new UserProfile.Statistics(0,0,0));
        UserDTO userDTO = new UserDTO(1L, "testuser", "password", "test@example.com");

        when(userProfileRepository.findByuserId(anyLong())).thenReturn(userProfile);
        when(restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=1", UserDTO.class))
                .thenReturn(new ResponseEntity<>(userDTO, HttpStatus.OK));

        mockMvc.perform(get("/user/profile").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.bio").value("Test bio"))
                .andExpect(jsonPath("$.avatarMediaId").value("https://example.com/avatar.jpg"));

        System.out.println("Passed testGetCurrentUserProfile_Success");
    }

    @Test
    public void testGetCurrentUserProfile_UserNotFound() throws Exception {
        when(userProfileRepository.findByuserId(anyLong())).thenReturn(null);

        mockMvc.perform(get("/user/profile").header("X-User-Id", 1L))
                .andExpect(status().isNotFound());

        System.out.println("Passed testGetCurrentUserProfile_UserNotFound");
    }

    @Test
    public void testGetCurrentUserProfile_FetchUserFailed() throws Exception {
        UserProfile userProfile = new UserProfile(1L, 1L, "test@example.com", "testuser", "Test bio", "https://example.com/avatar.jpg", LocalDate.now(), new UserProfile.Statistics(0,0,0));

        when(userProfileRepository.findByuserId(anyLong())).thenReturn(userProfile);
        when(restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=1", UserDTO.class))
                .thenReturn(new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(get("/user/profile").header("X-User-Id", 1L))
                .andExpect(status().isInternalServerError());

        System.out.println("Passed testGetCurrentUserProfile_FetchUserFailed");
    }

    @Test
    public void testGetCurrentUserProfile_Exception() throws Exception {
        when(userProfileRepository.findByuserId(anyLong())).thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/user/profile").header("X-User-Id", 1L))
                .andExpect(status().isInternalServerError());

        System.out.println("Passed testGetCurrentUserProfile_Exception");
    }
}