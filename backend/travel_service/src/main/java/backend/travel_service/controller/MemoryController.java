package backend.travel_service;

import backend.travel_service.entity.Memory;
import backend.travel_service.service.MemoryService;
// import backend.travel_service.dto.MemoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/memory")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @Autowired
    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping
    public ResponseEntity<String> getMemory() {
        System.out.println("GET /memory endpoint hit");
        return ResponseEntity.ok("Memory Service is running");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Memory>> getMemoriesByUserId(@PathVariable Long userId) {
        List<Memory> memories = memoryService.getMemoriesByUserId(userId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/pin/{pinId}")
    public ResponseEntity<List<Memory>> getMemoriesByPinId(@PathVariable Long pinId) {
        List<Memory> memories = memoryService.getMemoriesByPinId(pinId);
        return ResponseEntity.ok(memories);
    }

    @GetMapping("/user/{userId}/pin/{pinId}")
    public ResponseEntity<List<Memory>> getMemoriesByUserIdAndPinId(@PathVariable Long userId, @PathVariable Long pinId) {
        List<Memory> memories = memoryService.getMemoriesByUserIdAndPinId(userId, pinId);
        return ResponseEntity.ok(memories);
    }

    @PostMapping
    public ResponseEntity<Memory> postMemory(@RequestBody Memory memory) {
        Memory savedMemory = memoryService.postMemory(memory);
        return ResponseEntity.ok(savedMemory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemory(@PathVariable Long id) {
        memoryService.deleteMemoryById(id);
        return ResponseEntity.ok("Memory with ID " + id + " has been deleted / does not exist.");
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<String> editMemory(@PathVariable Long id, @RequestBody MemoryDto memoryDto) {
    //     memoryService.updateMemory(id, memoryDto);
    //     return ResponseEntity.ok("Memory updated successfully.");
    // }
}
