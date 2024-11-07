package backend.travel_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import backend.travel_service.entity.Pin;
import backend.travel_service.entity.Location;

public interface PinRepository extends JpaRepository<Pin, Long> {
    List<Pin> findByUserId(Long userId);

    List<Pin> findPinById(Long pinId);

    @Query("SELECT p.location FROM Pin p WHERE p.id IN :pinIds") // id = pinId
    List<Location> findVisitedLocations(List<Long> pinIds);
}
