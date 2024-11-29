package backend.user_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserProfileResponse;
import backend.user_service.dto.UserProfileUpdateRequest;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import backend.user_service.service.UserService;

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
        return userService.getCurrentUserProfile(userId);
    }

    @GetMapping("/username")
    public String getUsername(@RequestParam Long userId) {
        return userService.getUsernameByUserId(userId);
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the user profile");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<UserProfile> updateUserProfile(
            @RequestHeader("X-User-Id") Long userId, @ModelAttribute UserProfileUpdateRequest profileUpdateRequest) {
        try {
            // System.out.println("updated user profile image: " + profile.getUri());
            System.out.println("Updating user profile for user ID: " + userId);

            // Fetch the user profile using the user ID
            UserProfile userProfile = userProfileRepository.findByuserId(userId);
            if (userProfile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            System.out.println("User profile: " + userProfile);

            System.out.println("NEW PROFILE UPDATE: " + profileUpdateRequest);

            String username = profileUpdateRequest.getUsername();
            String bio = profileUpdateRequest.getBio();
            String base64Image = profileUpdateRequest.getImage();
            int citiesVisited = profileUpdateRequest.getCitiesVisited();
            int countriesVisited = profileUpdateRequest.getCountriesVisited();
            int continentsVisited = profileUpdateRequest.getContinentsVisited();

            if (bio != null) {
                userProfile.setBio(bio);
            }

            if (username != null) {
                userProfile.setUsername(username);
            }

            // If a file was uploaded, store it in S3 and update the media URL
            if (base64Image != null) {
                String mediaUrl = userService.uploadToS3(base64Image); // Upload file to S3
                if (userProfile.getAvatarMediaId()
                                != "https://travelog-media.s3.us-west-1.amazonaws.com/default-pfp.png"
                        && userProfile.getAvatarMediaId() != null) {
                    userService.deleteFromS3(userProfile.getAvatarMediaId());
                }
                userProfile.setAvatarMediaId(mediaUrl);
            }

            if (citiesVisited >= 0) {
                System.out.println("UPDATING CITIES");
                userProfile.getStatistics().setCitiesVisited(citiesVisited);
            }
            if (countriesVisited >= 0) {
                System.out.println("UPDATING COUNTRIES");
                userProfile.getStatistics().setCountriesVisited(countriesVisited);
            }
            if (continentsVisited >= 0) {
                System.out.println("UPDATING CONTINENTS");
                userProfile.getStatistics().setContinentsVisited(continentsVisited);
            }
            userProfileRepository.save(userProfile);
            return ResponseEntity.ok(userProfile);

        } catch (Exception e) {
            System.out.println("IN USER CONTROLLER UPDATE PROFILE -- FAILED");
            System.err.println("An error occurred while fetching the user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
