package backend.user_service.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}