package travelog_backend.auth_service.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import backend.auth_service.TestApplication;
import backend.auth_service.controller.HelloController;

@WebMvcTest(HelloController.class)
@AutoConfigureMockMvc(addFilters = false) // disable security for testing
@ContextConfiguration(classes = TestApplication.class) // need spring context config for testing
public class HelloControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testIndex() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Greetings from Spring Boot - Auth Service!!!!!!!"));
    }

    @Test
    public void testConnection_Success() throws Exception {
        List<Map<String, Object>> mockResult = Arrays.asList(new HashMap<String, Object>() {
            {
                put("username", "testuser");
            }
        });
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        mockMvc.perform(get("/test/auth-db-test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Connection successful! Retrieved data: " + mockResult.toString()));
    }
}
