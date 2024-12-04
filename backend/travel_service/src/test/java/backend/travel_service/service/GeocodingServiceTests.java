package backend.travel_service.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

public class GeocodingServiceTests {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private GeocodingService geocodingService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testParseLocationData_Error() throws Exception {
        String response = "invalid response";
        when(objectMapper.readTree(response)).thenThrow(new RuntimeException("Error parsing location data"));

        List<String> result = geocodingService.getLocationData(37.7749, -122.4194);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Error parsing location data", result.get(0));
        System.out.println("Passed testParseLocationData_Error");
    }
}