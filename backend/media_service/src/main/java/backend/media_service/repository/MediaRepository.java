package backend.media_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.media_service.entity.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
}