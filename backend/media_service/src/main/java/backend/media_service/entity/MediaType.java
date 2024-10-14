package backend.media_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import backend.auth_service.entity.User;

public enum MediaType {
    PHOTO,
    VIDEO
}

@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String mediaUrl; // URL or S3 path to the media file

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType mediaType; // PHOTO, VIDEO

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // FK to User in User Service (references user ID)

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = true) // nullable = true cause it could be a user pfp
    private Trip trip; // FK to Trip in Memory Service (references trip ID)

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMediaUrl() {
        return this.mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public MediaType getMediaType() {
        return this.mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    // Getters and setters for User and Trip relationships
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Trip getTrip() {
        return this.trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public LocalDateTime getUploadedAt() {
        return this.uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
