package backend.travel_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.travel_service.entity.Memory;

public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByUserId(Long userId);

    List<Memory> findByPinId(Long pinId);

    List<Memory> findByUserIdAndPinId(Long userId, Long pinId);

    @Query("SELECT m FROM Memory m WHERE LOWER(m.category) = LOWER(:category) AND m.userId = :userId")
    List<Memory> findByCategory(Long userId, String category);
}
