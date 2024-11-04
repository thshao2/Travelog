package travelog_backend.travel_service.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import backend.travel_service.service.MemoryService;
import backend.travel_service.controller.MemoryController;
import backend.travel_service.TestApplication;

@WebMvcTest(MemoryController.class)
@ContextConfiguration(classes = TestApplication.class)
public class MemoryControllerTests {
        @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemoryService memoryService; // Mock the MemoryService

    // @BeforeEach
    // public void setUp() {
    //     // setup
    // }

    // @Test

}
