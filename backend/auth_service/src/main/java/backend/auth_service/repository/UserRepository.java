package backend.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.auth_service.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	// Built in method for querying by username: 
	Optional<User> findByEmail(String email);
}
