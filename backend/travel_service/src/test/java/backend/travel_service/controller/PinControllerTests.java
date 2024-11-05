// // package backend.travel_service.controller;

// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// // import org.springframework.boot.test.mock.mockito.MockBean;
// // import org.springframework.test.context.ContextConfiguration;
// // import org.springframework.test.web.servlet.MockMvc;

// // import backend.travel_service.TestApplication;
// // import backend.travel_service.service.PinService;

// // @WebMvcTest(PinController.class)
// // @ContextConfiguration(classes = TestApplication.class)
// // public class PinControllerTests {

// //     @Autowired
// //     private MockMvc mockMvc;

// //     @MockBean
// //     private PinService pinService;

// //     // @BeforeEach
// //     // public void setUp() {
// //     //     // possible setup code
// //     // }

// //     // @Test

// // }

// package backend.travel_service.controller;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyLong;
// import static org.mockito.Mockito.when;

// import java.util.Arrays;
// import java.util.List;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;

// import backend.travel_service.entity.Location;
// import backend.travel_service.entity.Pin;
// import backend.travel_service.service.PinService;

// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
// import org.springframework.test.context.ContextConfiguration;
// import backend.travel_service.TestApplication;

// @WebMvcTest(PinController.class)
// @ContextConfiguration(classes = TestApplication.class)
// public class PinControllerTests {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private PinService pinService;

//     @Test
//     public void testPostPin_Success() throws Exception {
//         Location location = new Location(100, 100); // Fill in the necessary properties for Location
//         Pin savedPin = new Pin(); // Fill in the necessary properties for Pin
        
//         // Mock the service layer
//         when(pinService.postPin(any(Location.class), anyLong())).thenReturn(savedPin);

//         mockMvc.perform(post("/pin")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content("{\"someProperty\":\"someValue\"}") // Replace with actual JSON representation of Location
//                 .header("X-User-Id", 1))
//                 .andExpect(status().isOk())
//                 .andExpect(content().json("{\"id\":null,\"someProperty\":\"someValue\"}")); // Replace with actual expected JSON for savedPin
//     }

//     @Test
//     public void testGetPinList_Success() throws Exception {
//         List<Pin> pins = Arrays.asList(new Pin()); // Populate with example Pins
//         when(pinService.getPinList(anyLong())).thenReturn(pins);

//         mockMvc.perform(get("/pin")
//                 .header("X-User-Id", 1))
//                 .andExpect(status().isOk())
//                 .andExpect(content().json("[{\"id\":null,\"someProperty\":\"someValue\"}]")); // Replace with actual expected JSON for pins
//     }

//     @Test
//     public void testDeletePin_Success() throws Exception {
//         Long pinId = 1L; // Example pin ID to delete

//         mockMvc.perform(delete("/pin/{id}", pinId))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("Memory with ID " + pinId + " has been deleted / does not exist."));

//         // Verify that the service method was called
//         // Uncomment the line below if you want to verify service interactions
//         // verify(pinService).deletePinById(pinId);
//     }
// }


package backend.travel_service.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.service.PinService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.context.ContextConfiguration;
import backend.travel_service.TestApplication;
import java.time.LocalDateTime;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import backend.travel_service.service.PinService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PinController.class)
@ContextConfiguration(classes = TestApplication.class)
public class PinControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PinService pinService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private Pin savedPin;

    @BeforeEach
    public void setUp() {
        // Set up a sample Pin object for testing
        Location location = new Location(1L, 37.000141856791984, -122.06259410472599);
        savedPin = new Pin(1L, location, 1L, LocalDateTime.now());
    }


    @Test
    public void testDeletePin_Success() throws Exception {
        Long pinId = 1L;

        // Perform the DELETE request
        mockMvc.perform(delete("/pin/{id}", pinId))
                .andExpect(status().isOk())
                .andExpect(content().string("Memory with ID " + pinId + " has been deleted / does not exist."));

        // Verify that the service method was called
        verify(pinService).deletePinById(pinId);
    }
}
