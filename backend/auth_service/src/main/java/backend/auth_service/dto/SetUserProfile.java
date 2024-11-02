package backend.auth_service.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SetUserProfile {
    private Long userId;
    private String bio; // optional bio
    private Long avatarMediaId; // optional pfp
    private LocalDate joinedAt;
}
