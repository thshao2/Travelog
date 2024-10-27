package backend.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.user_service.entity.UserProfile;


public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    public UserProfile findByUserId(Long userId);
}