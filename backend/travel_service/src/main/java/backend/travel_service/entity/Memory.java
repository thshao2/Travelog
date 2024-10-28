package backend.travel_service.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "pin_id", nullable = false)
    private Long pinId; // FK to Pin

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private String category;

    @Column(nullable = false)
    private String loc;

    @Column(nullable = false)
    private String condition;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String captionText; 

    @Column(nullable = false)
    private LocalDateTime initDate; 

     @Column(nullable = false)
    private LocalDateTime endDate; 

    // private Long locationId; // FK to Location

    @ElementCollection
    @CollectionTable(name = "memory_media", joinColumns = @JoinColumn(name = "memory_id"))
    @Column(name = "media_id")
    private List<Long> mediaIds; // List of associated media IDs

    // alternative for json array
    // @Column(name = "media_ids", columnDefinition = "TEXT")
    // private String mediaIdsJson; // JSON array string of media IDs

    // @PrePersist
    // protected void onCreate() {
    //     this.initDate = LocalDateTime.now();
    //     this.endDate = LocalDateTime.now();
    // }
}
