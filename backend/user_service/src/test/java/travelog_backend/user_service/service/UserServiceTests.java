// package travelog_backend.user_service.service;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;
// import static org.junit.jupiter.api.Assertions.assertFalse;

// import org.junit.jupiter.api.BeforeAll;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import java.time.LocalDate;

// import backend.user_service.entity.UserProfile;
// import backend.user_service.repository.UserProfileRepository;
// import backend.user_service.service.UserService;

// import org.springframework.web.client.RestTemplate;

// import java.util.List;
// import java.util.Optional;
// import java.util.Arrays;


// public class UserServiceTests {
//     @Mock
//     private UserProfileRepository userRepository;

//     @Mock
//     private RestTemplate restTemplate;

//     @InjectMocks
//     private UserService userService;

//     private UserProfile userProfile;

//     @BeforeEach
//     void setup() {
//         MockitoAnnotations.openMocks(this);

//         userProfile = new UserProfile();

//         userProfile.setUserId(1L);
//         userProfile.setJoinedAt(LocalDate.now());
//         userProfile.setEmail("example@example.com");
//         userProfile.setUsername("testUser");
//         userProfile.setBio("Travelog enthusiast");
//         userProfile.setAvatarMediaId(2L);
//     }


//     // @Test
    

// }

