package travelog_backend.user_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserDTO;
import backend.user_service.dto.UserProfileResponse;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import backend.user_service.service.UserService;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

public class UserServiceTests {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private S3Client s3Client;

    @InjectMocks
    private UserService userService;

    private UserProfile userProfile;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        userProfile = new UserProfile();
        userProfile.setId(1L);
        userProfile.setUserId(1L);
        userProfile.setEmail("test@example.com");
        userProfile.setUsername("testuser");
        userProfile.setBio("Test bio");
        userProfile.setAvatarMediaId("https://example.com/avatar.jpg");
        userProfile.setJoinedAt(LocalDate.now());
        userProfile.setStatistics(new UserProfile.Statistics(0, 0, 0));
    }

    @Test
    void testGetUsernameByUserId_Success() {
        when(userProfileRepository.findUsernameByUserId(anyLong())).thenReturn("testuser");

        String username = userService.getUsernameByUserId(1L);

        assertEquals("testuser", username);
        System.out.println("Passed testGetUsernameByUserId_Success");
    }

    @Test
    void testGetCurrentUserProfile_Success() {
        UserDTO userDTO = new UserDTO(1L, "testuser", "password", "test@example.com");
        when(userProfileRepository.findByuserId(anyLong())).thenReturn(userProfile);
        when(restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=1", UserDTO.class))
                .thenReturn(new ResponseEntity<>(userDTO, HttpStatus.OK));

        ResponseEntity<UserProfileResponse> response = userService.getCurrentUserProfile(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals("Test bio", response.getBody().getBio());
        assertEquals("https://example.com/avatar.jpg", response.getBody().getAvatarMediaId());
        System.out.println("Passed testGetCurrentUserProfile_Success");
    }

    @Test
    void testGetCurrentUserProfile_UserNotFound() {
        when(userProfileRepository.findByuserId(anyLong())).thenReturn(null);

        ResponseEntity<UserProfileResponse> response = userService.getCurrentUserProfile(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        System.out.println("Passed testGetCurrentUserProfile_UserNotFound");
    }

    @Test
    void testGetCurrentUserProfile_FetchUserFailed() {
        when(userProfileRepository.findByuserId(anyLong())).thenReturn(userProfile);
        when(restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=1", UserDTO.class))
                .thenReturn(new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR));

        ResponseEntity<UserProfileResponse> response = userService.getCurrentUserProfile(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        System.out.println("Passed testGetCurrentUserProfile_FetchUserFailed");
    }

    @Test
    void testGetCurrentUserProfile_Exception() {
        when(userProfileRepository.findByuserId(anyLong())).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<UserProfileResponse> response = userService.getCurrentUserProfile(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        System.out.println("Passed testGetCurrentUserProfile_Exception");
    }

    @Test
    void testUpdateUserProfile_Success() {
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserProfile updatedProfile = userService.updateUserProfile(1L, "newuser", "New bio");

        assertNotNull(updatedProfile);
        assertEquals("newuser", updatedProfile.getUsername());
        assertEquals("New bio", updatedProfile.getBio());
        verify(userProfileRepository).save(userProfile);
        System.out.println("Passed testUpdateUserProfile_Success");
    }

    @Test
    void testUpdateUserProfile_UserNotFound() {
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.empty());

        UserProfile updatedProfile = userService.updateUserProfile(1L, "newuser", "New bio");

        assertEquals(null, updatedProfile);
        System.out.println("Passed testUpdateUserProfile_UserNotFound");
    }

    @Test
    void testUploadToS3_Success() {
        String base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAUA";
        String expectedUrl = "https://travelog-media.s3.amazonaws.com/unique-file-name-profile.jpg";
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(null);

        String mediaUrl = userService.uploadToS3(base64Image);

        assertNotNull(mediaUrl);
        System.out.println("Passed testUploadToS3_Success");
    }

    @Test
    void testUploadToS3_Failure() {
        String base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAUA";
        doThrow(new RuntimeException("Failed to upload file to S3"))
                .when(s3Client)
                .putObject(any(PutObjectRequest.class), any(RequestBody.class));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.uploadToS3(base64Image);
        });

        assertEquals("Failed to upload file to S3", exception.getMessage());
        System.out.println("Passed testUploadToS3_Failure");
    }

    @Test
    void testDeleteFromS3_Failure() {
        String mediaUrl = "https://travelog-media.s3.amazonaws.com/unique-file-name-profile.jpg";
        doThrow(new RuntimeException("Failed to delete file from S3"))
                .when(s3Client)
                .deleteObject(any(DeleteObjectRequest.class));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteFromS3(mediaUrl);
        });

        assertEquals("Failed to delete file from S3", exception.getMessage());
        System.out.println("Passed testDeleteFromS3_Failure");
    }
}
