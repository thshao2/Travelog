package backend.auth_service.exception;

public class DuplicateCredentialsException extends RuntimeException {
    public DuplicateCredentialsException(String message) {
        super(message);
    }
}
