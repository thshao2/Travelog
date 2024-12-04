
package backend.travel_service.service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
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
    void testGetPinList_Success() {
        List<Pin> pins = new ArrayList<>();
        pins.add(testPin);

        when(pinRepository.findByUserId(anyLong())).thenReturn(pins);

        List<Pin> result = pinService.getPinList(2L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testPin, result.get(0));
        System.out.println("Passed testGetPinList_Success");
    }

    @Test
    void testDeletePinById_Success() {
        Long pinId = testPin.getId();
        when(pinRepository.existsById(pinId)).thenReturn(true);
        doNothing().when(pinRepository).deleteById(pinId);
        doNothing().when(memoryRepository).updateMemoriesPinIdToNull(pinId);

        pinService.deletePinById(pinId);

        verify(pinRepository).deleteById(pinId);
        verify(memoryRepository).updateMemoriesPinIdToNull(pinId);
        System.out.println("Passed testDeletePinById_Success");
    }

    @Test
    void testDeletePinById_NotFound() {
        Long nonExistentPinId = 999L; // ID for a pin that does not exist
        when(pinRepository.existsById(nonExistentPinId)).thenReturn(false);

        pinService.deletePinById(nonExistentPinId);

        verify(pinRepository, never()).deleteById(nonExistentPinId);
        verify(memoryRepository, never()).updateMemoriesPinIdToNull(nonExistentPinId);
        System.out.println("Passed testDeletePinById_NotFound");
    }

    @Test
    void testGetCoordinatesById_Success() {
        Long pinId = testPin.getId();
        when(pinRepository.existsById(pinId)).thenReturn(true);
        when(pinRepository.findById(pinId)).thenReturn(Optional.of(testPin));

        List<Double> result = pinService.getCoordinatesById(pinId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(37.0002, result.get(0));
        assertEquals(122.0624, result.get(1));
        System.out.println("Passed testGetCoordinatesById_Success");
    }

    @Test
    void testGetCoordinatesById_NotFound() {
        Long nonExistentPinId = 999L; // ID for a pin that does not exist
        when(pinRepository.existsById(nonExistentPinId)).thenReturn(false);

        List<Double> result = pinService.getCoordinatesById(nonExistentPinId);

        assertNotNull(result);
        assertEquals(0, result.size());
        System.out.println("Passed testGetCoordinatesById_NotFound");
    }
}