package travelog_backend.auth_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;

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
