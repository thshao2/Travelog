package backend.travel_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.travel_service.entity.Memory;

public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByUserId(Long userId);

    List<Memory> findByPinId(Long pinId);

    List<Memory> findByUserIdAndPinId(Long userId, Long pinId);
}
