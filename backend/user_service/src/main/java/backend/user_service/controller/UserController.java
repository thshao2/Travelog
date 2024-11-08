package backend.user_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserDTO;
import backend.user_service.dto.UserProfileResponse;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import backend.user_service.service.UserService;

import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(@RequestHeader("X-User-Id") Long userId) {
        try {
            System.out.println("Fetching user profile for user ID: " + userId);

            // Fetch the user profile using the user ID
            UserProfile userProfile = userProfileRepository.findByuserId(userId);
            if (userProfile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            System.out.println("User profile: " + userProfile);

            // need to do these calls but dont work for some reason
            // ResponseEntity<UserDTO> response = restTemplate.getForEntity(apiUrl + "/auth/user?userId=" + userId,
            // UserDTO.class);
            // ResponseEntity<String> mediaResponse = restTemplate.getForEntity(apiUrl + "/media/profile?mediaId=" +
            // userProfile.getAvatarMediaId(), String.class);

            // Fetch the user using user ID
            ResponseEntity<UserDTO> response =
                    restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=" + userId, UserDTO.class);
            System.out.println("User response: " + response);

            String mediaUrl = null;
            if (userProfile.getAvatarMediaId() != null) {
                // Fetch the media profile using media ID
                ResponseEntity<String> mediaResponse = restTemplate.getForEntity(
                        "http://media-service:3010/media/profile?mediaId=" + userProfile.getAvatarMediaId(),
                        String.class);
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

    @PostMapping("/create")
    public ResponseEntity<String> createProfile(@RequestBody UserProfile userProfile) {
        try {
            System.out.println("Creating new user profile for user ID: " + userProfile.getUserId());

            // Call the service method to create a new profile
            boolean isCreated = userService.createNewProfile(userProfile);

            if (isCreated) {
                return ResponseEntity.status(HttpStatus.CREATED).body("User profile created successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create user profile");
            }
        } catch (Exception e) {
            System.err.println("An error occurred while creating the user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the user profile");
        }
    }


    @PutMapping("/update")
    public ResponseEntity<Boolean> updateUserProfile(
        @RequestHeader("X-User-Id") Long userId,
        @RequestParam("username") String username,
        @RequestParam("bio") String bio,
        @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // System.out.println("updated user profile image: " + profile.getUri());
            System.out.println("Updating user profile for user ID: " + userId);

            // Fetch the user profile using the user ID
            UserProfile userProfile = userProfileRepository.findByuserId(userId);
            if (userProfile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            System.out.println("User profile: " + userProfile);

            if (bio != null) {
                userProfile.setBio(bio);
            }

            if (username != null) {
                userProfile.setUsername(username);
            }

            // make a put request to auth service to update the user profile for the profile username, email fields
            // UserDTO userDTO = new UserDTO();
            // userDTO.setId(userId);
            // userDTO.setUsername(profile.getUsername());
            // userDTO.setPassword(profile.getPassword());
            // ResponseEntity<UserDTO> response = restTemplate.exchange(
            //         "http://auth-service:3010/auth/user/update",
            //         HttpMethod.PUT,
            //         new HttpEntity<>(userDTO),
            //         UserDTO.class);
            // System.out.println("User response final: " + response);

            // If a file was uploaded, store it in S3 and update the media URL
            if (file != null && !file.isEmpty()) {
                // String mediaUrl = userService.uploadToS3(file); // Upload file to S3
                // userProfile.setMediaUrl(mediaUrl);
            }

            userProfileRepository.save(userProfile);
            return ResponseEntity.ok(true);

        } catch (Exception e) {
            System.err.println("An error occurred while fetching the user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
