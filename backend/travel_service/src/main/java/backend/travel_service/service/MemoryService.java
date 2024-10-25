package backend.travel_service.service;

import backend.travel_service.entity.Memory;
import backend.travel_service.repository.MemoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemoryService {

    @Autowired
    private MemoryRepository memoryRepository;

    public List<Memory> getMemoriesByUserId(Long userId) {
        return memoryRepository.findByUserId(userId);
    }

    public List<Memory> getMemoriesByPinId(Long pinId) {
        return memoryRepository.findByPinId(pinId);
    }

    public List<Memory> getMemoriesByUserIdAndPinId(Long userId, Long pinId) {
        return memoryRepository.findByUserIdAndPinId(userId, pinId);
    }

    public Memory postMemory(Memory memory) {
        return memoryRepository.save(memory);
    }

    public void deleteMemoryById(Long memoryId) {
        if (memoryRepository.existsById(memoryId)) {
            memoryRepository.deleteById(memoryId);
            System.out.println("Memory with ID " + memoryId + " was deleted successfully.");
        } else {
            System.out.println("Memory with ID " + memoryId + " does not exist.");
        }
    }
}
