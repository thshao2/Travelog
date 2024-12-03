package travelog_backend.media_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.media_service.entity.Media;
import backend.media_service.repository.MediaRepository;
import backend.media_service.service.MediaService;

public class MediaServiceTests {

    @Mock 
    private MediaRepository mediaRepository;

    @InjectMocks
    private MediaService mediaService;

    private Media media;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        media = new Media();
        media.setId(1L);
        media.setMediaUrl("https://example.com/media.jpg");
    }

    @Test
    void testGetMediaById_Success() {
        when(mediaRepository.findById(anyLong())).thenReturn(Optional.of(media));

        Media foundMedia = mediaService.getMediaById(1L);

        assertNotNull(foundMedia);
        assertEquals("https://example.com/media.jpg", foundMedia.getMediaUrl());
        System.out.println("Passed testGetMediaById_Success");
    }

    @Test
    void testGetMediaById_NotFound() {
        when(mediaRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            mediaService.getMediaById(1L);
        });

        assertEquals("Media not found", exception.getMessage());
        System.out.println("Passed testGetMediaById_NotFound");
    }
}