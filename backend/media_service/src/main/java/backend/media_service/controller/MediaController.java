package backend.media_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.media_service.dto.MediaDTO;
import backend.media_service.service.MediaService;
import backend.media_service.entity.Media;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @GetMapping("/profile")
    public ResponseEntity<String> getProfilePicture(@RequestParam Long mediaId) {
        try {
            Media media = mediaService.getMediaById(mediaId);
            if (media != null) {
                return ResponseEntity.ok(media.getMediaUrl());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Media not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while retrieving the media");
        }
    }

    // @PostMapping("/travel")
    // public ResponseEntity<String> createImageS3Link(@RequestParam String base64) {
    //     try {
    //         Media media = mediaService.getMediaById(mediaId);
    //         if (media != null) {
    //             return ResponseEntity.ok(media.getMediaUrl());
    //         } else {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Media not found");
    //         }
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while retrieving the media");
    //     }
    }

}