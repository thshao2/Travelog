package backend.user_service.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // FK to User in Auth service

    @Column(unique = true)
    private String email;

    @Column(unique = false, nullable = true)
    private String username;

    @Column(nullable = true, length = 500)
    private String bio;

    @Column(name = "avatar_media_id", nullable = true) // FK to Media table for avatar
    private String avatarMediaId; // Reference to Media entity for the avatar (later)

    @Column(nullable = false)
    private LocalDate joinedAt;
}
