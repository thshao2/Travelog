package travelog_backend.travel_service.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

import backend.travel_service.service.PinService;
import backend.travel_service.controller.PinController;
import backend.travel_service.entity.Pin;
import backend.travel_service.TestApplication;

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
