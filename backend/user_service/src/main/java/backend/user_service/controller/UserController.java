package backend.user_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserDTO;
import backend.user_service.dto.UserProfileResponse;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(@RequestHeader("X-User-Id") Long userId) {
        try {
            System.out.println("Fetching user profile for user ID: " + userId);

            // Fetch the user profile using the user ID
            UserProfile userProfile = userProfileRepository.findByuserId(userId);
            System.out.println(userProfile);
            if (userProfile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            System.out.println("User profile: " + userProfile);

            // need to do these calls but dont work for some reason
            // ResponseEntity<UserDTO> response = restTemplate.getForEntity(apiUrl + "/auth/user?userId=" + userId, UserDTO.class);
            // ResponseEntity<String> mediaResponse = restTemplate.getForEntity(apiUrl + "/media/profile?mediaId=" + userProfile.getAvatarMediaId(), String.class);

            // Fetch the user using user ID
            System.out.println("apiUrl: " + apiUrl);
            ResponseEntity<UserDTO> response = restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=" + userId, UserDTO.class);
            System.out.println("User response: " + response);

            String mediaUrl = null;
            if (userProfile.getAvatarMediaId() != null) {
                // Fetch the media profile using media ID
                ResponseEntity<String> mediaResponse = restTemplate.getForEntity("http://media-service:3010/media/profile?mediaId=" + userProfile.getAvatarMediaId(), String.class);
                System.out.println("Media response: " + mediaResponse);
                if (mediaResponse.getStatusCode().is2xxSuccessful()) {
                    mediaUrl = mediaResponse.getBody();
                } else {
                    System.out.println("Failed to fetch media");
                }
            }

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Fetched user successfully");
                UserDTO userDTO = response.getBody();

                // Create a response DTO combining user and user profile
                UserProfileResponse userProfileResponse = new UserProfileResponse();
                if (userDTO != null) {
                    userProfileResponse.setUsername(userDTO.getUsername());
                    userProfileResponse.setEmail(userDTO.getEmail());
                }
                userProfileResponse.setBio(userProfile.getBio());
                if (mediaUrl != null) {
                    userProfileResponse.setAvatarMediaId(mediaUrl);
                }
                System.out.println("Returning user profile response: " + userProfileResponse);
                return ResponseEntity.ok(userProfileResponse);
            } else {
                System.out.println("Failed to fetch user");
                return ResponseEntity.status(response.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            System.err.println("An error occurred while fetching the user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}