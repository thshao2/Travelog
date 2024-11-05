package backend.travel_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import backend.travel_service.entity.Memory;

public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByUserId(Long userId);

    List<Memory> findByPinId(Long pinId);

    List<Memory> findByUserIdAndPinId(Long userId, Long pinId);

    // @Query("SELECT m FROM Memory m WHERE LOWER(m.category) = LOWER(:category) AND m.userId = :userId")
    @Query("SELECT m FROM Memory m WHERE m.category = :category AND m.userId = :userId")
    List<Memory> findByCategory(Long userId, String category);

    @Query("SELECT DISTINCT m.category FROM Memory m WHERE m.userId = :userId")
    List<String> findDistinctCategories(Long userId);

    @Query("SELECT m.pinId FROM Memory m WHERE m.userId = :userId AND m.condition = 'Visited'")
    List<Long> findVisitedPins(Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Memory m SET m.pinId = null WHERE m.pinId = :pinId")
    void updateMemoriesPinIdToNull(Long pinId);
}
