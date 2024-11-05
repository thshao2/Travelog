package backend.travel_service.service;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.repository.LocationRepository;
import backend.travel_service.repository.PinRepository;

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
