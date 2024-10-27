package backend.user_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserDTO;
import backend.user_service.dto.UserProfileResponse;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import backend.user_service.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    @PostMapping("/create-profile")
    public ResponseEntity<String> createUserProfile(@RequestBody UserProfile userProfile) {
        try {
            UserProfile newUserProfile = new UserProfile();
            newUserProfile.setUserId(userProfile.getUserId()); // Set FK to user
            newUserProfile.setJoinedAt(userProfile.getJoinedAt()); // Set joined date
            newUserProfile.setBio(userProfile.getBio());
            newUserProfile.setAvatarMediaId(userProfile.getAvatarMediaId());
            userProfileRepository.save(newUserProfile); // Save the user profile
            return ResponseEntity.ok().body("User profile created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create user profile");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(@RequestHeader("X-User-Id") Long userId) {
        try {
            System.out.println("Fetching user profile for user ID: " + userId);
            // Fetch the user profile using the user ID
            UserProfile userProfile = userProfileRepository.findByUserId(userId);
            System.out.println("User profile: " + userProfile);
            // Fetch the user using user ID
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(apiUrl + "/auth/user?userId=" + userId, UserDTO.class);
            System.out.println("User response: " + response);
            ResponseEntity<String> mediaResponse = restTemplate.getForEntity(apiUrl + "/media/profile?=mediaId=" + userProfile.getAvatarMediaId(), String.class);
            System.out.println("Media response: " + mediaResponse);
            if (response.getStatusCode().is2xxSuccessful() && mediaResponse.getStatusCode().is2xxSuccessful()) {
                System.out.println("Fetched user and media successfully");
                UserDTO userDTO = response.getBody();
                String mediaUrl = mediaResponse.getBody();

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
                System.out.println("Failed to fetch user or media");
                return ResponseEntity.status(response.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}