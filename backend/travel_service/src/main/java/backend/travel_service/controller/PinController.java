package backend.travel_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestHeader;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.service.PinService;

@RestController
@RequestMapping("/pin")
public class PinController {

    @Autowired
    private PinService pinService;

    @PostMapping
    public ResponseEntity<Pin> postPin(@RequestBody Location location, @RequestHeader("X-User-Id") Long userId) {
        Pin savedPin = pinService.postPin(location, userId);
        return ResponseEntity.ok(savedPin);
    }

    @GetMapping
    public ResponseEntity<List<Pin>> getPinList(@RequestHeader("X-User-Id") Long userId) {
        List<Pin> pins = pinService.getPinList(userId);
        return ResponseEntity.ok(pins);
    }
}
