package travelog_backend.travel_service.service;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.service.MemoryService;

public class MemoryServiceTests {
    @Mock
    private MemoryRepository memoryRepository;

    @InjectMocks
    private MemoryService memoryService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // @Test

}
