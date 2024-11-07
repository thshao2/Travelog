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

    private final String apiKey = "pk.eyJ1IjoiZnlzaGloIiwiYSI6ImNtMzVwNjQ0YzA1Mmoyam9qaXVoN3ljemkifQ.QRRhMrpEB70fij6DhzJsxg"; // LIMITED # REQS/MONTH !!!

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    public GeocodingService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // get geocoding data
    public List<String> getLocationData(double latitude, double longitude) {
        String url = MAPBOX_URL + "longitude=" + longitude + "&latitude=" + latitude + "&types=place&access_token=" + apiKey;

        String response = restTemplate.getForObject(url, String.class);

        return parseLocationData(response);
    }

    // parse location data to get city + country
    private List<String> parseLocationData(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            System.out.println("-- PARSED JSON: -- " + rootNode.toString());

            // extract place (city) and country name
            JsonNode firstFeature = rootNode.path("features").get(0);
            String city = firstFeature.path("properties").path("name").asText("Unknown city");
            String country = firstFeature.path("properties").path("context").path("country").path("name").asText("Unknown country");

            return Arrays.asList(city, country);

        } catch (Exception e) {
            e.printStackTrace();
            return Arrays.asList("Error parsing location data");
        }
    }
}