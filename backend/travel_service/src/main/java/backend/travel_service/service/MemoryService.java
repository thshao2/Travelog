package backend.travel_service.service;

import java.util.List;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.travel_service.dto.MemoryDto;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Memory;
import backend.travel_service.entity.Location;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;
import backend.travel_service.utils.CountryContinentMapping;
import backend.travel_service.service.GeocodingService;


@Service
public class MemoryService {

    @Autowired
    private MemoryRepository memoryRepository;

    @Autowired
    private PinRepository pinRepository;

    @Autowired
    private GeocodingService geocodingService;

    public List<Memory> getMemoriesByUserId(Long userId) {
        return memoryRepository.findByUserId(userId);
    }

    public List<Memory> getMemoriesByPinId(Long pinId) {
        return memoryRepository.findByPinId(pinId);
    }

    public List<Memory> getMemoriesByUserIdAndPinId(Long userId, Long pinId) {
        return memoryRepository.findByUserIdAndPinId(userId, pinId);
    }

    public List<Memory> getMemoriesByCategory(Long userId, String category) {
        return memoryRepository.findByCategory(userId, category);
    }

    public List<String> getDistinctCategories(Long userId) {
        return memoryRepository.findDistinctCategories(userId);
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

    public void updateMemory(Long memoryId, MemoryDto memoryDto) {
        Memory memory = memoryRepository.findById(memoryId).orElseThrow(() -> new RuntimeException("Memory not found"));
        memory.setTitle(memoryDto.getTitle());
        memory.setCategory(memoryDto.getCategory());
        memory.setLoc(memoryDto.getLoc());
        memory.setCondition(memoryDto.getCondition());
        memory.setCaptionText(memoryDto.getCaptionText());
        memory.setInitDate(memoryDto.getInitDate());
        memory.setEndDate(memoryDto.getEndDate());
        memoryRepository.save(memory);
    }

    public List<Location> getVisitedLocations(Long userId) {
        // get all 'visited' pins
        List<Long> visitedPinIds = memoryRepository.findVisitedPins(userId);

        // get locations of 'visited' pins
        List<Location> visitedLocations = pinRepository.findVisitedLocations(visitedPinIds);

        return visitedLocations;
    }

    public VisitedStatsDto getVisitedStats(Long userId) {
        // get list of visited locations
        List<Location> visitedLocations = getVisitedLocations(userId);

        Set<String> continents = new HashSet<>();
        Set<String> countries = new HashSet<>();
        Set<String> cities = new HashSet<>();
        
        // put into set
        for (Location location : visitedLocations) {
            List<String> locationData = geocodingService.getLocationData(location.getLatitude(), location.getLongitude());
            String country = locationData.get(0); 
            String city = locationData.get(1);
            
            // Add country and city to the sets
            countries.add(country);
            cities.add(city);
            
            // identify continent + add into set only if found
            String continent = CountryContinentMapping.getContinentByCountry(country);
            if (!"Unknown".equals(continent)) {
                continents.add(continent);
            }
        }

        // Return the stats as a DTO
        return new VisitedStatsDto(continents.size(), countries.size(), cities.size());
    }

}
