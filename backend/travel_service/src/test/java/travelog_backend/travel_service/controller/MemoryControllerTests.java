package travelog_backend.travel_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import backend.travel_service.TestApplication;
import backend.travel_service.controller.MemoryController;
import backend.travel_service.service.MemoryService;

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
