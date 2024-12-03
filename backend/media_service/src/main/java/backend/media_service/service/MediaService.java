package backend.media_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.media_service.dto.MediaDTO;
import backend.media_service.repository.MediaRepository;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    public Media getMediaById(Long mediaId) {
        return mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));
    }
}