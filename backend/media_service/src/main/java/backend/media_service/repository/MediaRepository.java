package backend.media_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.media_service.entity.Media;

public interface MediaRepository extends JpaRepository<Media, Long> {
	// example methods
	// List<Media> findByUserId(Long userId);
    // List<Media> findByTripId(Long tripId);
}
