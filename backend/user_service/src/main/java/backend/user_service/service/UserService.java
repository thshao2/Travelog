package backend.user_service.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import java.io.IOException;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;


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
}
