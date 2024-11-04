package backend.travel_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import backend.travel_service.service.MemoryService;
import backend.travel_service.dto.MemoryDto;
import backend.travel_service.entity.Memory;
import backend.travel_service.repository.MemoryRepository;

import java.util.List;
import java.util.Optional;
import java.util.Arrays;

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

