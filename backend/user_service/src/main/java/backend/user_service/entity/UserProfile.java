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
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // FK to User in Auth service

    @Column(nullable = true, length = 500)
    private String bio;

    @Column(name = "avatar_media_id", nullable = true) // FK to Media table for avatar
    private Long avatarMediaId; // Reference to Media entity for the avatar

    @Column(nullable = false)
    private LocalDate joinedAt;
}
