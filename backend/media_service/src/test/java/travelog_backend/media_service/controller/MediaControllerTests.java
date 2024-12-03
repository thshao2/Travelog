package travelog_backend.media_service.controller;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import backend.media_service.TestApplication;
import backend.media_service.controller.MediaController;
import backend.media_service.entity.Media;
import backend.media_service.service.MediaService;

@WebMvcTest(MediaController.class)
@ContextConfiguration(classes = TestApplication.class) // need spring context config for testing
public class MediaControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MediaService mediaService;

    private Media media;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        media = new Media();
        media.setId(1L);
        media.setMediaUrl("https://example.com/media.jpg");
    }

    @Test
    public void testGetProfilePicture_Success() throws Exception {
        when(mediaService.getMediaById(anyLong())).thenReturn(media);

        mockMvc.perform(get("/media/profile").param("mediaId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mediaUrl").value("https://example.com/media.jpg"));

        System.out.println("Passed testGetProfilePicture_Success");
    }

    @Test
    public void testGetProfilePicture_NotFound() throws Exception {
        when(mediaService.getMediaById(anyLong())).thenThrow(new RuntimeException("Media not found"));

        mockMvc.perform(get("/media/profile").param("mediaId", "1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("Media not found"));

        System.out.println("Passed testGetProfilePicture_NotFound");
    }
}