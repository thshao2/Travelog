package backend.travel_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.travel_service.entity.Pin;

public interface PinRepository extends JpaRepository<Pin, Long> {
    List<Pin> findByUserId(Long userId);

    List<Pin> findPinById(Long pinId);
}
