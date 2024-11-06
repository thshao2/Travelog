package backend.travel_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.travel_service.dto.MemoryDto;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Memory;
import backend.travel_service.service.MemoryService;
import backend.travel_service.service.GeocodingService;

@RestController
@RequestMapping("/memory")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping
    public ResponseEntity<String> getMemory() {
        System.out.println("GET /memory endpoint hit");
        return ResponseEntity.ok("Memory Service is running");
    }

    @GetMapping("/user")
    public ResponseEntity<List<Memory>> getMemoriesByUserId(@RequestHeader("X-User-Id") Long userId) {
        List<Memory> memories = memoryService.getMemoriesByUserId(userId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/pin/{pinId}")
    public ResponseEntity<List<Memory>> getMemoriesByPinId(@PathVariable Long pinId) {
        List<Memory> memories = memoryService.getMemoriesByPinId(pinId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/{pinId}")
    public ResponseEntity<List<Memory>> getMemoriesByUserIdAndPinId(
            @RequestHeader("X-User-Id") Long userId, @PathVariable Long pinId) {
        List<Memory> memories = memoryService.getMemoriesByUserIdAndPinId(userId, pinId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Memory>> getMemoriesByCategory(
            @RequestHeader("X-User-Id") Long userId, @PathVariable String category) {
        List<Memory> memories = memoryService.getMemoriesByCategory(userId, category);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/categories")
    public List<String> getDistinctCategories(@RequestHeader("X-User-Id") Long userId) {
        return memoryService.getDistinctCategories(userId);
    }

    @PostMapping
    public ResponseEntity<Memory> postMemory(@RequestBody Memory memory, @RequestHeader("X-User-Id") Long userId) {
        memory.setUserId(userId);
        Memory savedMemory = memoryService.postMemory(memory);
        return ResponseEntity.ok(savedMemory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemory(@PathVariable Long id) {
        memoryService.deleteMemoryById(id);
        return ResponseEntity.ok("Memory with ID " + id + " has been deleted / does not exist.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editMemory(@PathVariable Long id, @RequestBody MemoryDto memoryDto) {
        memoryService.updateMemory(id, memoryDto);
        return ResponseEntity.ok("Memory updated successfully.");
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<VisitedStatsDto> getVisitedStats(@PathVariable Long userId) {
        VisitedStatsDto stats = memoryService.getVisitedStats(userId);
        return ResponseEntity.ok(stats);
    }
}
