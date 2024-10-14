package backend.travel_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.travel_service.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {

}
