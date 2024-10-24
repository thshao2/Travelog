package backend.travel_service;

import backend.travel_service.entity.Memory;
import backend.travel_service.service.MemoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/memory")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @GetMapping
    public ResponseEntity<String> getMemory() {
        System.out.println("GET /memory endpoint hit");
        return ResponseEntity.ok("Memory Service is running");
    }

    @Autowired
    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Memory>> getMemoriesByUserId(@PathVariable Long userId) {
        List<Memory> memories = memoryService.getMemoriesByUserId(userId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<Memory>> getMemoriesByLocationId(@PathVariable Long locationId) {
        List<Memory> memories = memoryService.getMemoriesByLocationId(locationId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/user/{userId}/location/{locationId}")
    public ResponseEntity<List<Memory>> getMemoriesByUserIdAndLocationId(@PathVariable Long userId, @PathVariable Long locationId) {
        List<Memory> memories = memoryService.getMemoriesByUserIdAndLocationId(userId, locationId);
        return ResponseEntity.ok(memories);
    }

    @PostMapping
    public ResponseEntity<Memory> postMemory(@RequestBody Memory memory) {
        Memory savedMemory = memoryService.postMemory(memory);
        return ResponseEntity.ok(savedMemory);
    }
}
