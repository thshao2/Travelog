package backend.travel_service.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.List;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Location;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;

@ExtendWith(MockitoExtension.class)
public class GeocodingServiceTests {

    @Mock
    private MemoryRepository memoryRepository;

    @Mock
    private PinRepository pinRepository;

    @InjectMocks
    private MemoryService memoryService;

    @Test
    public void testGetVisitedStats() {
        Long userId = 1L;
        Location location = new Location(34.0522, -118.2437);

        // Mock the repository methods
        when(memoryRepository.findVisitedPins(userId)).thenReturn(List.of(1L, 2L));
        when(pinRepository.findVisitedLocations(List.of(1L, 2L))).thenReturn(visitedLocations);

        // Call the service method
        VisitedStatsDto stats = memoryService.getVisitedStats(userId);

        // Verify results
        assertEquals(1, stats.getContinents());
        assertEquals(1, stats.getCountries());
        assertEquals(2, stats.getCities());
    }
}

