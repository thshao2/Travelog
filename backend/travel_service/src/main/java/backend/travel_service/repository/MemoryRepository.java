package backend.travel_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.travel_service.entity.Memory;

import java.util.List;

public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByUserId(Long userId);
    List<Memory> findByLocationId(Long locationId);
    List<Memory> findByUserIdAndLocationId(Long userId, Long locationId);
}
