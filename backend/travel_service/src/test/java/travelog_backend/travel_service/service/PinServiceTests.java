package travelog_backend.travel_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.repository.LocationRepository;
import backend.travel_service.repository.PinRepository;
import backend.travel_service.service.PinService;

import java.util.List;
import java.util.Optional;
import java.util.Arrays;

import java.time.LocalDateTime;

public class PinServiceTests {
    @Mock
    private PinRepository pinRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private PinService pinService;

    private Location testLocation;
    private Pin testPin;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // create test location
        testLocation = new Location();
        testLocation.setId(5L);
        testLocation.setLatitude(37.0002);
        testLocation.setLongitude(122.0624); 
        
        // create test pin
        testPin = new Pin();
        testPin.setId(1L);
        testPin.setLocation(testLocation);
        testPin.setUserId(2L);
        testPin.setCreatedAt(LocalDateTime.now()); // Set createdAt for testing
    }


    // @Test
    

}

