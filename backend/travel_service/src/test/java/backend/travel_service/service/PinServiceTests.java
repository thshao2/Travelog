package backend.travel_service.service;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.repository.LocationRepository;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;

public class PinServiceTests {
    @Mock
    private PinRepository pinRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private MemoryRepository memoryRepository;

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

    @Test
    void testDeletePinById_Success() {
        // Arrange
        Long pinId = testPin.getId();
        when(pinRepository.existsById(pinId)).thenReturn(true);
        doNothing().when(pinRepository).deleteById(pinId);
        doNothing().when(memoryRepository).updateMemoriesPinIdToNull(pinId);

        // Act
        pinService.deletePinById(pinId);

        // Assert
        verify(pinRepository).deleteById(pinId);
        verify(memoryRepository).updateMemoriesPinIdToNull(pinId);
        // verifyNoMoreInteractions(pinRepository, memoryRepository);
    }

    @Test
    void testDeletePinById_NotFound() {
        // Arrange
        Long nonExistentPinId = 999L; // ID for a pin that does not exist
        when(pinRepository.existsById(nonExistentPinId)).thenReturn(false); // Mocking the repository response

        // Act
        pinService.deletePinById(nonExistentPinId); // Call the method to test

        // Assert
        // Verify that these were never called
        verify(pinRepository, never()).deleteById(nonExistentPinId);
        verify(memoryRepository, never()).updateMemoriesPinIdToNull(nonExistentPinId);
    }
}
