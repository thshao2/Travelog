package backend.user_service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import backend.user_service.entity.UserProfile;
import backend.user_service.repository.UserProfileRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public void run(String... args) throws Exception {
        // Define some dummy UserProfile data
        UserProfile profile1 = new UserProfile(
                12456L, 1L, "travelog@gmail.com", "travelog", "Bio for Travelog", null, LocalDate.now(), new UserProfile.Statistics(0,0,0));
        UserProfile profile2 =
                new UserProfile(12345L, 2L, "molly@gmail.com", "Molly Member", "Bio for Molly", null, LocalDate.now(), new UserProfile.Statistics(0,0,0));
        UserProfile profile3 =
                new UserProfile(16546L, 3L, "anna@gmail.com", "Anna Admin", "Bio for Anna", null, LocalDate.now(), new UserProfile.Statistics(0,0,0));

        // Insert the data only if it doesn't exist
        if (!userProfileRepository.existsByEmail(profile1.getEmail())) {
            userProfileRepository.save(profile1);
        }
        if (!userProfileRepository.existsByEmail(profile2.getEmail())) {
            userProfileRepository.save(profile2);
        }
        if (!userProfileRepository.existsByEmail(profile3.getEmail())) {
            userProfileRepository.save(profile3);
        }

        System.out.println("Dummy profile data initialized.");
    }
}
