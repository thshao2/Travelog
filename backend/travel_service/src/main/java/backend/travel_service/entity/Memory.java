package backend.travel_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "memories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Memory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // FK to User in User Service

    @Column(nullable = false)
    private String captionText; 

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; 

    private Long locationId; // FK to Location

    @ElementCollection
    @CollectionTable(name = "memory_media", joinColumns = @JoinColumn(name = "memory_id"))
    @Column(name = "media_id")
    private List<Long> mediaIds; // List of associated media IDs

    // alternative for json array
    // @Column(name = "media_ids", columnDefinition = "TEXT")
    // private String mediaIdsJson; // JSON array string of media IDs

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
