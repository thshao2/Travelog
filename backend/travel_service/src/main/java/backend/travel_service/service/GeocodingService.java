package backend.travel_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeocodingService {
    private final String MAPBOX_URL = "https://api.mapbox.com/search/geocode/v6/reverse?";

    private final String apiKey = "--"; // LIMITED # REQS/MONTH !!!

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    public GeocodingService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // get geocoding data
    public String getLocationData(double latitude, double longitude) {
        String url = MAPBOX_URL + "longitude=" + longitude + "&latitude=" + latitude + "&types=place&access_token=" + apiKey;

        String response = restTemplate.getForObject(url, String.class);

        return parseLocationData(response);
    }

    // parse location data to get city + country
    private String parseLocationData(String response) {
        // TODO: parse stuff here
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            // extract place name
            JsonNode firstFeature = rootNode.path("features").get(0);
            String placeName = firstFeature.path("properties").path("name").asText("Unknown Place");

            // extract country name
            JsonNode context = firstFeature.path("context");
            String countryName = "Unknown Country";

            for (JsonNode ctx : context) {
                if (ctx.has("country")) {
                    countryName = ctx.path("country").asText("Unknown Country");
                    break;
                }
            }
            return "Place: " + placeName + ", Country: " + countryName;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing location data";
        }
    }
}