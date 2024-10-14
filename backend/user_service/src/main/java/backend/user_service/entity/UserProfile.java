package backend.user_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import backend.media_service.entity.Media;
import backend.auth_service.entity.User;

@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
	@JoinColumn(name = "user_id", nullable = false)
    private User user; // FK to User in Auth service

    @Column(nullable = true, length = 500)
    private String bio;

    @ManyToOne
    @JoinColumn(name = "avatar_media_id", nullable = true) // FK to Media table for avatar
    private Media avatar; // Reference to Media entity for the avatar

    @Column(nullable = false)
    private LocalDate joinedAt;

    // Getters and Setters
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBio() {
        return this.bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

	// need to expand more on the avatar methods, just template code for now
    public Media getAvatar() {
        return this.avatar; // Get the Media object for avatar
    }

    public void setAvatar(Media avatar) {
        this.avatar = avatar; // Set the Media object for avatar
    }

    public LocalDate getJoinedAt() {
        return this.joinedAt;
    }

    public void setJoinedAt(LocalDate joinedAt) {
        this.joinedAt = joinedAt;
    }
}
