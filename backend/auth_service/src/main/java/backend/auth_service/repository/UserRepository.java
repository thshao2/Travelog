package backend.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.auth_service.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	// sample methods
	// Optional<User> findByUsername(String username);
	// Optional<User> findByEmail(String email);
}
