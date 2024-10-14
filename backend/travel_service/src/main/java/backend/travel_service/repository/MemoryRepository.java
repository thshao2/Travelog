package backend.travel_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.travel_service.entity.Memory;

public interface MemoryRepository extends JpaRepository<Memory, Long> {

}
