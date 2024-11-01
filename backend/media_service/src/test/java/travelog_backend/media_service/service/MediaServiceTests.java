package travelog_backend.media_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;

import backend.media_service.service.MediaService;

public class MediaServiceTests {

    @Mock 
    private MediaRepository mediaRepository;

    @InjectMocks
    private MediaService mediaService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }


    // @Test

    
}