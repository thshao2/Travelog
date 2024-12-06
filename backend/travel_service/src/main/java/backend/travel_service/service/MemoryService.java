package backend.travel_service.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import backend.travel_service.dto.MemoryDto;
import backend.travel_service.dto.UserProfileResponse;
import backend.travel_service.dto.UserProfileUpdateRequest;
import backend.travel_service.dto.VisitedStatsDto;
import backend.travel_service.entity.Location;
import backend.travel_service.entity.Memory;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;
import backend.travel_service.utils.CountryContinentMapping;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
public class MemoryService {

    @Autowired
    private MemoryRepository memoryRepository;

    @Autowired
    private PinRepository pinRepository;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private S3Client s3Client;

    @Autowired
    private RestTemplate restTemplate;

    public List<Memory> getAllMemories() {
        return memoryRepository.findAll(Sort.by(Sort.Direction.DESC, "endDate"));
    }

    public List<Memory> getMemoriesByUserId(Long userId) {
        return memoryRepository.findByUserIdOrderByEndDateDesc(userId);
    }

    public List<Memory> getMemoriesByPinId(Long pinId) {
        return memoryRepository.findByPinIdOrderByEndDateDesc(pinId);
    }

    public List<Memory> getMemoriesByUserIdAndPinId(Long userId, Long pinId) {
        return memoryRepository.findByUserIdAndPinIdOrderByEndDateDesc(userId, pinId);
    }

    public List<Memory> getMemoriesByCategory(Long userId, String category) {
        return memoryRepository.findByCategory(userId, category);
    }

    public List<String> getDistinctCategories(Long userId) {
        return memoryRepository.findDistinctCategories(userId);
    }

    public Memory postMemory(Memory memory) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Parse captionText as a List of Maps with Object values
            List<Map<String, Object>> captionSections =
                    objectMapper.readValue(memory.getCaptionText(), new TypeReference<List<Map<String, Object>>>() {});
            System.out.println("ABOVE FOR LOOP IN POSTMEMORY");
            for (Map<String, Object> section : captionSections) {
                String type = (String) section.get("type");

                if ("image".equals(type)) {
                    // Handle single image
                    String content = (String) section.get("content");
                    String S3URL = uploadToS3(content, memory.getTitle());
                    section.put("content", S3URL);
                    System.out.println("S3URL: " + S3URL);

                } else if ("text".equals(type)) {
                    // Handle text content
                    String content = (String) section.get("content");
                    System.out.println("Text content: " + content);
                }
            }

            // Serialize updated captionSections back to JSON
            memory.setCaptionText(objectMapper.writeValueAsString(captionSections));
            // System.out.println(memory.getCaptionText());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return memoryRepository.save(memory);
    }

    private String uploadToS3(String base64Image, String title) {
        System.out.println("HERE IN UPLAODTOS3");
        byte[] decodedImage = Base64.getDecoder().decode(base64Image);
        String bucketName = "travelog-media";
        String uniqueFileName = UUID.randomUUID() + "-" + title + ".png";

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(uniqueFileName)
                            .build(),
                    RequestBody.fromBytes(decodedImage));
            return "https://" + bucketName + ".s3.amazonaws.com/" + uniqueFileName;
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file to S3");
        }
    }

    private void deleteFromS3(String mediaURL) {
        String bucketName = "travelog-media";

        // Extract the key from the media URL
        String key = mediaURL.substring(mediaURL.lastIndexOf("/") + 1);

        try {
            s3Client.deleteObject(
                    DeleteObjectRequest.builder().bucket(bucketName).key(key).build());
            System.out.println("Successfully deleted " + mediaURL + " from S3.");
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete file from S3");
        }
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
        memory.setInitDate(memoryDto.getInitDate());
        memory.setEndDate(memoryDto.getEndDate());

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Parse captionText as a List of Maps with Object values
            List<Map<String, Object>> captionSections = objectMapper.readValue(
                    memoryDto.getCaptionText(), new TypeReference<List<Map<String, Object>>>() {});
            List<Map<String, Object>> previousCaptionSections =
                    objectMapper.readValue(memory.getCaptionText(), new TypeReference<List<Map<String, Object>>>() {});

            // Collect URLs of images in previous and current sections
            Set<String> previousImageUrls = previousCaptionSections.stream()
                    .filter(section -> "image".equals(section.get("type")))
                    .map(section -> (String) section.get("content"))
                    .collect(Collectors.toSet());

            Set<String> currentImageUrls = captionSections.stream()
                    .filter(section -> "image".equals(section.get("type")))
                    .map(section -> (String) section.get("content"))
                    .collect(Collectors.toSet());

            // Determine deleted images (in previous but not in current)
            Set<String> deletedImages = new HashSet<>(previousImageUrls);
            deletedImages.removeAll(currentImageUrls);
            deletedImages.forEach(this::deleteFromS3);

            // Determine added images (in current but not in previous)
            Set<String> addedImages = new HashSet<>(currentImageUrls);
            addedImages.removeAll(previousImageUrls);

            for (Map<String, Object> section : captionSections) {
                String type = (String) section.get("type");
                String content = (String) section.get("content");

                if ("image".equals(type) && addedImages.contains(content)) {
                    // Upload new image to S3 and replace content with S3 URL
                    String S3URL = uploadToS3(content, memory.getTitle());
                    section.put("content", S3URL);
                }
            }

            // Update captionText with modified captionSections
            memory.setCaptionText(objectMapper.writeValueAsString(captionSections));
        } catch (Exception e) {
            e.printStackTrace();
        }

        memoryRepository.save(memory);
    }

    public List<Location> getVisitedLocations(Long userId) {
        // get all 'visited' pins
        List<Long> visitedPinIds = memoryRepository.findVisitedPins(userId);
        System.out.println("IN MEMORY SERVICE JAVA -- CHECKING RESULTS OF QUERIES");
        System.out.println(visitedPinIds);

        // get locations of 'visited' pins
        List<Location> visitedLocations = pinRepository.findVisitedLocations(visitedPinIds);
        List<Location> allLocations = pinRepository.findAllLocations();
        System.out.println(allLocations);

        return visitedLocations;
    }

    public VisitedStatsDto getVisitedStats(Long userId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", String.valueOf(userId));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // get user profile
            ResponseEntity<UserProfileResponse> response = restTemplate.exchange(
                    "http://user-service:3010/user/profile", HttpMethod.GET, entity, UserProfileResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // userprofileresponse
                UserProfileResponse userProfileResponse = response.getBody();

                if (userProfileResponse == null) {
                    System.out.println("memoryService - getVisitedStats, null user profile");
                    return null;
                }
                // put stats into visitedStatsDto
                VisitedStatsDto visitedStatsDto = new VisitedStatsDto();
                visitedStatsDto.setVisitedContinentCount(userProfileResponse.getContinentsVisited());
                visitedStatsDto.setVisitedCountryCount(userProfileResponse.getCountriesVisited());
                visitedStatsDto.setVisitedCityCount(userProfileResponse.getCitiesVisited());

                return visitedStatsDto;
            } else {
                System.out.println("memoryService -- getVisitedStats error");
                return null;
            }
        } catch (Exception e) {
            System.out.println("An error occured while fectching visited stats: " + e);
            return null;
        }
    }

    public VisitedStatsDto updateVisitedStats(Long userId) {
        // get list of visited locations
        List<Location> visitedLocations = getVisitedLocations(userId);

        // Initialize sets
        Set<String> continents = new HashSet<>();
        Set<String> countries = new HashSet<>();
        Set<String> cities = new HashSet<>();

        // Put into set
        for (Location location : visitedLocations) {
            List<String> locationData =
                    geocodingService.getLocationData(location.getLatitude(), location.getLongitude());
            String city = locationData.get(0);
            String country = locationData.get(1);

            // Add country and city to the sets
            countries.add(country);
            cities.add(city);

            // Identify continent and add into set only if found
            String continent = CountryContinentMapping.getContinentByCountry(country);
            if (!"Unknown".equals(continent)) {
                continents.add(continent);
            }
        }
        // check for size
        System.out.println(continents.size());
        System.out.println(countries.size());
        System.out.println(cities.size());

        for (String country : countries) {
            System.out.println(country);
        }

        for (String city : cities) {
            System.out.println(city);
        }

        UserProfileUpdateRequest userProfileUpdateRequest = new UserProfileUpdateRequest();
        userProfileUpdateRequest.setCitiesVisited(cities.size());
        userProfileUpdateRequest.setCountriesVisited(countries.size());
        userProfileUpdateRequest.setContinentsVisited(continents.size());

        // Prepare the form data to send in the request body
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("citiesVisited", String.valueOf(userProfileUpdateRequest.getCitiesVisited()));
        map.add("countriesVisited", String.valueOf(userProfileUpdateRequest.getCountriesVisited()));
        map.add("continentsVisited", String.valueOf(userProfileUpdateRequest.getContinentsVisited()));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", String.valueOf(userId));
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

            restTemplate.exchange("http://user-service:3010/user/update", HttpMethod.PUT, entity, Void.class);
        } catch (Exception e) {
            System.err.println("An error occurred while updating the user profile: " + e);
        }
        return getVisitedStats(userId);
    }

    public VisitedStatsDto getDefaultLocation(double latitude, double longitude) {
        List<String> defaultLocation = geocodingService.getLocationData(latitude, longitude);
        VisitedStatsDto visitedStatsDto = new VisitedStatsDto();
        visitedStatsDto.setDefaultLocation(defaultLocation.get(2));
        return visitedStatsDto;
    }
    // Get array of s3 urls for overview slideshow
    public List<String> getOverviewUrls(Long userId, String category) {
        // Get all memories
        List<Memory> memories = memoryRepository.findByCategory(userId, category);

        // For each memory, add to list of S3 urls
        List<String> overviewUrls = new ArrayList<>();

        for (Memory memory : memories) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // From postMemory
                // Parse captionText as a List of Maps with Object values
                List<Map<String, Object>> captionSections = objectMapper.readValue(
                        memory.getCaptionText(), new TypeReference<List<Map<String, Object>>>() {});
                // Collect URLs of images in previous and current sections
                Set<String> urls = captionSections.stream()
                        .filter(section -> "image".equals(section.get("type")))
                        .map(section -> (String) section.get("content"))
                        .collect(Collectors.toSet());

                overviewUrls.addAll(urls);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return overviewUrls;
    }
}
