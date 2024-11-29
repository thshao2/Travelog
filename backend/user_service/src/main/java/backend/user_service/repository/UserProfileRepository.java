package backend.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.user_service.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    public UserProfile findByuserId(Long userId);

    public boolean existsByEmail(String email);

    @Query("SELECT u.username FROM UserProfile u WHERE u.userId = :userId")
    String findUsernameByUserId(@Param("userId") Long userId);
}
