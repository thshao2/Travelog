package backend.travel_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import backend.auth_service.entity.User;


@Entity
@Table(name = "pins")
public class Pin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false) // FK to Location
    private Location location;

    @ManyToOne
    @JoinColumn(name = "memory_id", nullable = false) // FK to Memory
    private Memory memory;

    @Column(nullable = false)
    private Long userId; // FK to User in User Service

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Timestamp for when the pin was created

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Timestamp for when the pin was last updated

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Memory getMemory() {
        return this.memory;
    }

    public void setMemory(Memory memory) {
        this.memory = memory;
    }

    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }
}
