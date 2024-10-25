package backend.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.user_service.entity.UserProfile;

import java.util.Optional;


public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
}