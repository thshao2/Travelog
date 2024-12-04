package backend.travel_service.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.travel_service.TestApplication;
import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.service.PinService;

@WebMvcTest(PinController.class)
@ContextConfiguration(classes = TestApplication.class)
public class PinControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PinService pinService;

    private ObjectMapper objectMapper;

    private Pin pin;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();
        Location location = new Location(1L, 37.000141856791984, -122.06259410472599);
        pin = new Pin(1L, location, 1L, LocalDateTime.now());
    }

    @Test
    public void testDeletePin_Success() throws Exception {
        doNothing().when(pinService).deletePinById(anyLong());

        mockMvc.perform(delete("/pin/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Memory with ID 1 has been deleted / does not exist."));

        System.out.println("Passed testDeletePin_Success");
    }

    @Test
    public void testGetPinCoordinates_Success() throws Exception {
        List<Double> coordinates = List.of(37.000141856791984, -122.06259410472599);

        when(pinService.getCoordinatesById(anyLong())).thenReturn(coordinates);

        mockMvc.perform(get("/pin/get-coordinates/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(coordinates)));

        System.out.println("Passed testGetPinCoordinates_Success");
    }
}