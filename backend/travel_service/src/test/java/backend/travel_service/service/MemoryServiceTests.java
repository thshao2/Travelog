package backend.travel_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import backend.travel_service.dto.MemoryDto;
import backend.travel_service.dto.UserProfileResponse;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Location;
import backend.travel_service.entity.Memory;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;
import software.amazon.awssdk.services.s3.S3Client;

public class MemoryServiceTests {

    @Mock
    private MemoryRepository memoryRepository;

    @Mock
    private PinRepository pinRepository;

    @Mock
    private GeocodingService geocodingService;

    @Mock
    private S3Client s3Client;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MemoryService memoryService;

    private Memory memory;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        memory = new Memory();
        memory.setId(1L);
        memory.setUserId(1L);
        memory.setTitle("Test Memory");
        memory.setCategory("Test Category");
        memory.setLoc("Test Location");
        memory.setCondition("Test Condition");
        memory.setInitDate(LocalDateTime.parse("2023-01-01T00:00:00"));
        memory.setEndDate(LocalDateTime.parse("2023-01-02T00:00:00"));
        memory.setCaptionText("[{\"type\":\"text\",\"content\":\"Test caption\"}]");
    }

    @Test
    void testGetAllMemories_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findAll(Sort.by(Sort.Direction.DESC, "endDate"))).thenReturn(memories);

        List<Memory> result = memoryService.getAllMemories();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Memory", result.get(0).getTitle());
        System.out.println("Passed testGetAllMemories_Success");
    }

    @Test
    void testGetMemoriesByUserId_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findByUserIdOrderByEndDateDesc(anyLong())).thenReturn(memories);

        List<Memory> result = memoryService.getMemoriesByUserId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Memory", result.get(0).getTitle());
        System.out.println("Passed testGetMemoriesByUserId_Success");
    }

    @Test
    void testGetMemoriesByPinId_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findByPinIdOrderByEndDateDesc(anyLong())).thenReturn(memories);

        List<Memory> result = memoryService.getMemoriesByPinId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Memory", result.get(0).getTitle());
        System.out.println("Passed testGetMemoriesByPinId_Success");
    }

    @Test
    void testGetMemoriesByUserIdAndPinId_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findByUserIdAndPinIdOrderByEndDateDesc(anyLong(), anyLong()))
                .thenReturn(memories);

        List<Memory> result = memoryService.getMemoriesByUserIdAndPinId(1L, 1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Memory", result.get(0).getTitle());
        System.out.println("Passed testGetMemoriesByUserIdAndPinId_Success");
    }

    @Test
    void testGetMemoriesByCategory_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findByCategory(anyLong(), any(String.class))).thenReturn(memories);

        List<Memory> result = memoryService.getMemoriesByCategory(1L, "Test Category");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Memory", result.get(0).getTitle());
        System.out.println("Passed testGetMemoriesByCategory_Success");
    }

    @Test
    void testGetDistinctCategories_Success() {
        List<String> categories = new ArrayList<>();
        categories.add("Test Category");

        when(memoryRepository.findDistinctCategories(anyLong())).thenReturn(categories);

        List<String> result = memoryService.getDistinctCategories(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Category", result.get(0));
        System.out.println("Passed testGetDistinctCategories_Success");
    }

    @Test
    void testPostMemory_Success() {
        when(memoryRepository.save(any(Memory.class))).thenReturn(memory);

        Memory result = memoryService.postMemory(memory);

        assertNotNull(result);
        assertEquals("Test Memory", result.getTitle());
        verify(memoryRepository).save(memory);
        System.out.println("Passed testPostMemory_Success");
    }

    @Test
    void testUpdateMemory_Success() {
        MemoryDto memoryDto = new MemoryDto();
        memoryDto.setTitle("Updated Memory");
        memoryDto.setCategory("Updated Category");
        memoryDto.setLoc("Updated Location");
        memoryDto.setCondition("Updated Condition");
        memoryDto.setInitDate(LocalDateTime.parse("2023-01-01T00:00:00"));
        memoryDto.setEndDate(LocalDateTime.parse("2023-01-02T00:00:00"));
        memoryDto.setCaptionText("[{\"type\":\"text\",\"content\":\"Updated caption\"}]");

        when(memoryRepository.findById(anyLong())).thenReturn(Optional.of(memory));
        when(memoryRepository.save(any(Memory.class))).thenReturn(memory);

        memoryService.updateMemory(1L, memoryDto);

        assertEquals("Updated Memory", memory.getTitle());
        assertEquals("Updated Category", memory.getCategory());
        assertEquals("Updated Location", memory.getLoc());
        assertEquals("Updated Condition", memory.getCondition());
        verify(memoryRepository).save(memory);
        System.out.println("Passed testUpdateMemory_Success");
    }

    @Test
    void testUpdateMemory_NotFound() {
        MemoryDto memoryDto = new MemoryDto();
        memoryDto.setTitle("Updated Memory");
        memoryDto.setCategory("Updated Category");
        memoryDto.setLoc("Updated Location");
        memoryDto.setCondition("Updated Condition");
        memoryDto.setInitDate(LocalDateTime.parse("2023-01-01T00:00:00"));
        memoryDto.setEndDate(LocalDateTime.parse("2023-01-02T00:00:00"));
        memoryDto.setCaptionText("[{\"type\":\"text\",\"content\":\"Updated caption\"}]");

        when(memoryRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            memoryService.updateMemory(1L, memoryDto);
        });

        assertEquals("Memory not found", exception.getMessage());
        System.out.println("Passed testUpdateMemory_NotFound");
    }

    @Test
    void testDeleteMemoryById_Success() {
        when(memoryRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(memoryRepository).deleteById(anyLong());

        memoryService.deleteMemoryById(1L);

        verify(memoryRepository).deleteById(1L);
        System.out.println("Passed testDeleteMemoryById_Success");
    }

    @Test
    void testDeleteMemoryById_NotFound() {
        when(memoryRepository.existsById(anyLong())).thenReturn(false);

        memoryService.deleteMemoryById(1L);

        verify(memoryRepository).existsById(1L);
        System.out.println("Passed testDeleteMemoryById_NotFound");
    }

    @Test
    void testGetVisitedLocations_Success() {
        List<Long> visitedPinIds = new ArrayList<>();
        visitedPinIds.add(1L);

        List<Location> visitedLocations = new ArrayList<>();
        Location location = new Location();
        location.setLatitude(1.0);
        location.setLongitude(1.0);
        visitedLocations.add(location);

        when(memoryRepository.findVisitedPins(anyLong())).thenReturn(visitedPinIds);
        when(pinRepository.findVisitedLocations(any(List.class))).thenReturn(visitedLocations);

        List<Location> result = memoryService.getVisitedLocations(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1.0, result.get(0).getLatitude());
        assertEquals(1.0, result.get(0).getLongitude());
        System.out.println("Passed testGetVisitedLocations_Success");
    }

    @Test
    void testGetVisitedStats_Success() {
        UserProfileResponse userProfileResponse = new UserProfileResponse();
        userProfileResponse.setCitiesVisited(1);
        userProfileResponse.setCountriesVisited(1);
        userProfileResponse.setContinentsVisited(1);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", "1");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        when(restTemplate.exchange(any(String.class), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
                .thenReturn(new ResponseEntity<>(userProfileResponse, HttpStatus.OK));

        VisitedStatsDto result = memoryService.getVisitedStats(1L);

        assertNotNull(result);
        assertEquals(1, result.getVisitedCityCount());
        assertEquals(1, result.getVisitedCountryCount());
        assertEquals(1, result.getVisitedContinentCount());
        System.out.println("Passed testGetVisitedStats_Success");
    }

    @Test
    void testGetVisitedStats_Failure() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", "1");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        when(restTemplate.exchange(any(String.class), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
                .thenReturn(new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR));

        VisitedStatsDto result = memoryService.getVisitedStats(1L);

        assertEquals(null, result);
        System.out.println("Passed testGetVisitedStats_Failure");
    }

    @Test
    void testGetDefaultLocation_Success() {
        List<String> locationData = List.of("Test City", "Test Country", "Test Continent");

        when(geocodingService.getLocationData(any(Double.class), any(Double.class)))
                .thenReturn(locationData);

        VisitedStatsDto result = memoryService.getDefaultLocation(1.0, 1.0);

        assertNotNull(result);
        assertEquals("Test Continent", result.getDefaultLocation());
        System.out.println("Passed testGetDefaultLocation_Success");
    }

    @Test
    void testGetOverviewUrls_Success() {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryRepository.findByCategory(anyLong(), any(String.class))).thenReturn(memories);

        List<String> result = memoryService.getOverviewUrls(1L, "Test Category");

        assertNotNull(result);
        assertEquals(0, result.size()); // No images in the caption text
        System.out.println("Passed testGetOverviewUrls_Success");
    }
}
