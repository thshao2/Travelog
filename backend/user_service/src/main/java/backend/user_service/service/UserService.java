package backend.user_service.service;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import backend.user_service.dto.UserDTO;
import backend.user_service.dto.UserProfileResponse;
import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;


@Service
public class UserService {

    @Autowired
    private UserProfileRepository user_repository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private S3Client s3Client;

    public boolean createNewProfile(UserProfile profile) {
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setUserId(profile.getUserId()); // Set FK to user
        newUserProfile.setJoinedAt(profile.getJoinedAt()); // Set joined date
        newUserProfile.setEmail(profile.getEmail());
        newUserProfile.setUsername(profile.getUsername());
        newUserProfile.setBio(profile.getBio());
        newUserProfile.setAvatarMediaId(profile.getAvatarMediaId());
        user_repository.save(newUserProfile); // Save the user profile
        return true;
    }

    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(Long userId) {
        try {
            System.out.println("Fetching user profile for user ID: " + userId);

            // Fetch the user profile using the user ID
            UserProfile userProfile = user_repository.findByuserId(userId);
            if (userProfile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            System.out.println("User profile: " + userProfile);

            // Fetch the user using user ID
            ResponseEntity<UserDTO> response =
                    restTemplate.getForEntity("http://auth-service:3010/auth/user?userId=" + userId, UserDTO.class);
            System.out.println("User response: " + response);

            String mediaUrl = null;
            if (userProfile.getAvatarMediaId() != null) {
                mediaUrl = userProfile.getAvatarMediaId();
            } else {
                mediaUrl = "https://travelog-media.s3.us-west-1.amazonaws.com/default-pfp.png";
            }

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Fetched user successfully");
                UserDTO userDTO = response.getBody();

                // Create a response DTO combining user and user profile
                UserProfileResponse userProfileResponse = new UserProfileResponse();
                if (userDTO != null) {
                    userProfileResponse.setEmail(userDTO.getEmail());
                }
                userProfileResponse.setUsername(userProfile.getUsername());
                userProfileResponse.setBio(userProfile.getBio());
                userProfileResponse.setAvatarMediaId(mediaUrl);
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

    public UserProfile updateUserProfile(Long userId, String newUsername, String newBio) {
        Optional<UserProfile> userProfileOpt = user_repository.findById(userId);
        System.out.println("USER ID: " + userId.toString());
        System.out.println("USERNAME: " + newUsername.toString());
        System.out.println("USER BIO: " + newBio.toString());

        if (userProfileOpt.isPresent()) {
            UserProfile userProfile = userProfileOpt.get();
            userProfile.setUsername(newUsername);
            userProfile.setBio(newBio);
            System.out.println("USER PROFILE ID: " + userProfile.getId().toString());
            System.out.println("USERNAME PROFILE: " + userProfile.getUsername().toString());
            System.out.println("USER PROFILE BIO: " + userProfile.getBio().toString());
            return user_repository.save(userProfile);
        } else {
            return null;
        }
    }

    public String uploadToS3(String base64Image) {
        byte[] decodedImage = Base64.getDecoder().decode(base64Image);
        String bucketName = "travelog-media";
        String uniqueFileName = UUID.randomUUID() + "-profile.jpg";
    
        try {
            s3Client.putObject(
                PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .build(),
                RequestBody.fromBytes(decodedImage)
            );
            return "https://" + bucketName + ".s3.amazonaws.com/" + uniqueFileName;
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file to S3");
        }
    }

    public void deleteFromS3(String mediaURL) {
        String bucketName = "travelog-media";
        
        // Extract the key from the media URL
        String key = mediaURL.substring(mediaURL.lastIndexOf("/") + 1);
    
        try {
            s3Client.deleteObject(
                DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build()
            );
            System.out.println("Successfully deleted " + mediaURL + " from S3.");
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete file from S3");
        }
    }
}
