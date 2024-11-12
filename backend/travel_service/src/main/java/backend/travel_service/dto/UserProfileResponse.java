package backend.travel_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String username;
    private String email;
    private String bio;
    private String avatarMediaId;
    private String password;
    private String uri;

    private int citiesVisited;
    private int countriesVisited;
    private int continentsVisited;
}
