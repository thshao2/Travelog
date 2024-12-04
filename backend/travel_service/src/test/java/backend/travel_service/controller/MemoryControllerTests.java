package backend.travel_service.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.travel_service.TestApplication;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Memory;
import backend.travel_service.service.MemoryService;

@WebMvcTest(MemoryController.class)
@ContextConfiguration(classes = TestApplication.class)
public class MemoryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemoryService memoryService;

    private ObjectMapper objectMapper;

    private Memory memory;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();
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
    public void testGetAllMemories_Success() throws Exception {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryService.getAllMemories()).thenReturn(memories);

        mockMvc.perform(get("/memory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Memory"));

        System.out.println("Passed testGetAllMemories_Success");
    }

    @Test
    public void testGetMemoriesByUserId_Success() throws Exception {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryService.getMemoriesByUserId(anyLong())).thenReturn(memories);

        mockMvc.perform(get("/memory/user").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Memory"));

        System.out.println("Passed testGetMemoriesByUserId_Success");
    }

    @Test
    public void testGetMemoriesByPinId_Success() throws Exception {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryService.getMemoriesByPinId(anyLong())).thenReturn(memories);

        mockMvc.perform(get("/memory/pin/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Memory"));

        System.out.println("Passed testGetMemoriesByPinId_Success");
    }

    @Test
    public void testGetMemoriesByUserIdAndPinId_Success() throws Exception {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryService.getMemoriesByUserIdAndPinId(anyLong(), anyLong())).thenReturn(memories);

        mockMvc.perform(get("/memory/1").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Memory"));

        System.out.println("Passed testGetMemoriesByUserIdAndPinId_Success");
    }

    @Test
    public void testGetMemoriesByCategory_Success() throws Exception {
        List<Memory> memories = new ArrayList<>();
        memories.add(memory);

        when(memoryService.getMemoriesByCategory(anyLong(), anyString())).thenReturn(memories);

        mockMvc.perform(get("/memory/category/Test Category").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Memory"));

        System.out.println("Passed testGetMemoriesByCategory_Success");
    }

    @Test
    public void testGetDistinctCategories_Success() throws Exception {
        List<String> categories = new ArrayList<>();
        categories.add("Test Category");

        when(memoryService.getDistinctCategories(anyLong())).thenReturn(categories);

        mockMvc.perform(get("/memory/categories").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Test Category"));

        System.out.println("Passed testGetDistinctCategories_Success");
    }

    @Test
    public void testDeleteMemory_Success() throws Exception {
        doNothing().when(memoryService).deleteMemoryById(anyLong());

        mockMvc.perform(delete("/memory/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value("Memory with ID 1 has been deleted / does not exist."));

        System.out.println("Passed testDeleteMemory_Success");
    }

    @Test
    public void testGetVisitedStats_Success() throws Exception {
        VisitedStatsDto stats = new VisitedStatsDto();
        stats.setVisitedCityCount(1);
        stats.setVisitedCountryCount(1);
        stats.setVisitedContinentCount(1);

        when(memoryService.getVisitedStats(anyLong())).thenReturn(stats);

        mockMvc.perform(get("/memory/stats").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.visitedCityCount").value(1))
                .andExpect(jsonPath("$.visitedCountryCount").value(1))
                .andExpect(jsonPath("$.visitedContinentCount").value(1));

        System.out.println("Passed testGetVisitedStats_Success");
    }

    @Test
    public void testUpdateVisitedStats_Success() throws Exception {
        VisitedStatsDto stats = new VisitedStatsDto();
        stats.setVisitedCityCount(1);
        stats.setVisitedCountryCount(1);
        stats.setVisitedContinentCount(1);

        when(memoryService.updateVisitedStats(anyLong())).thenReturn(stats);

        mockMvc.perform(post("/memory/update-stats").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.visitedCityCount").value(1))
                .andExpect(jsonPath("$.visitedCountryCount").value(1))
                .andExpect(jsonPath("$.visitedContinentCount").value(1));

        System.out.println("Passed testUpdateVisitedStats_Success");
    }

    @Test
    public void testGetDefaultLocation_Success() throws Exception {
        VisitedStatsDto stats = new VisitedStatsDto();
        stats.setDefaultLocation("Test Location");

        when(memoryService.getDefaultLocation(any(Double.class), any(Double.class))).thenReturn(stats);

        mockMvc.perform(get("/memory/default-loc")
                .param("latitude", "1.0")
                .param("longitude", "1.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultLocation").value("Test Location"));

        System.out.println("Passed testGetDefaultLocation_Success");
    }

    @Test
    public void testGetOverviewByCategory_Success() throws Exception {
        List<String> urls = new ArrayList<>();
        urls.add("https://example.com/image1.jpg");

        when(memoryService.getOverviewUrls(anyLong(), anyString())).thenReturn(urls);

        mockMvc.perform(get("/memory/category-overview/Test Category").header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("https://example.com/image1.jpg"));

        System.out.println("Passed testGetOverviewByCategory_Success");
    }
}