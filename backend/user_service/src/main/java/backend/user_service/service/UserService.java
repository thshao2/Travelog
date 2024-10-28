package backend.user_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository user_repository;

    @Autowired
    private RestTemplate restTemplate;

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
}