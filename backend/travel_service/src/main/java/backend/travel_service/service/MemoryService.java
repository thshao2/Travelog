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

    public List<Memory> getMemoriesByLocationId(Long locationId) {
        return memoryRepository.findByLocationId(locationId);
    }

    public List<Memory> getMemoriesByUserIdAndLocationId(Long userId, Long locationId) {
        return memoryRepository.findByUserIdAndLocationId(userId, locationId);
    }

    public Memory postMemory(Memory memory) {
        return memoryRepository.save(memory);
    }
}
