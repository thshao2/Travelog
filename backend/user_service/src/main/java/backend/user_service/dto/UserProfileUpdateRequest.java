package backend.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {
    private String username;
    private String bio;
    private String image;

    private int citiesVisited;
    private int countriesVisited;
    private int continentsVisited;
}
