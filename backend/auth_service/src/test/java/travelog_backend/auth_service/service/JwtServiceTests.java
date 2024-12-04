package travelog_backend.auth_service.service;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import backend.auth_service.service.JwtService;

public class JwtServiceTests {

    @InjectMocks
    private JwtService jwtService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // @Test

}
