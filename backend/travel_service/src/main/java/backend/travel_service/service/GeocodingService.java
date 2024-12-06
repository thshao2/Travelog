package backend.travel_service.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeocodingService {
    private final String MAPBOX_URL = "https://api.mapbox.com/search/geocode/v6/reverse?";

    private final String apiKey =
            "pk.eyJ1IjoiZnlzaGloIiwiYSI6ImNtMzVwNjQ0YzA1Mmoyam9qaXVoN3ljemkifQ.QRRhMrpEB70fij6DhzJsxg"; // 100,000/month

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    public GeocodingService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // Get geocoding data -- json response
    public List<String> getLocationData(double latitude, double longitude) {
        String url = MAPBOX_URL + "longitude=" + longitude + "&latitude=" + latitude + "&access_token=" + apiKey;
        String response = restTemplate.getForObject(url, String.class);

        return parseLocationData(response);
    }

    // Parse location data to get city, country, and defaultLocation
    private List<String> parseLocationData(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            System.out.println("Parsed JSON: " + rootNode.toString());

            // Extract city and country name
            JsonNode addrNode = rootNode.path("features").get(0).path("properties"); // up until "properties"
            String city = addrNode.path("context").path("place").path("name").asText("Unknown City");
            String country =
                    addrNode.path("context").path("country").path("name").asText("Unknown Country");
            String defaultLoc = addrNode.path("full_address").asText("Enter location...");
            
            System.out.println(defaultLoc);
            
            return Arrays.asList(city, country, defaultLoc);

        } catch (Exception e) {
            e.printStackTrace();
            return Arrays.asList("Error parsing location data");
        }
    }
}
