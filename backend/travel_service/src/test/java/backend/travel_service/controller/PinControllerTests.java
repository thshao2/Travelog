package backend.travel_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import backend.travel_service.TestApplication;
import backend.travel_service.service.PinService;

@WebMvcTest(PinController.class)
@ContextConfiguration(classes = TestApplication.class)
public class PinControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PinService pinService;

    // @BeforeEach
    // public void setUp() {
    //     // possible setup code
    // }

    // @Test

}
