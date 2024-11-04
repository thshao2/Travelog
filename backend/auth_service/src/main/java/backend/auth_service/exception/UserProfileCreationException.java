package backend.auth_service.exception;

public class UserProfileCreationException extends RuntimeException {
    public UserProfileCreationException(String message) {
        super(message);
    }
}