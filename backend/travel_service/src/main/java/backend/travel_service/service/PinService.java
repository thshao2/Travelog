package backend.travel_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.repository.LocationRepository;
import backend.travel_service.repository.PinRepository;

@Service
public class PinService {
    @Autowired
    private PinRepository pinRepository;

    @Autowired
    private LocationRepository locationRepository;

    public Pin postPin(Location location, Long userId) {
        // Save location to database
        locationRepository.save(location);

        // Create a new Pin object with all the information
        Pin pin = new Pin();
        pin.setUserId(userId);
        pin.setLocation(location);
        System.out.println("Newly created pin: " + pin);

        // Save to database
        pinRepository.save(pin);
        System.out.println("Pin successfully saved: " + pinRepository.findByUserId(userId));

        return pin;
    }

    public List<Pin> getPinList(Long userId) {
        return pinRepository.findByUserId(userId);
    }
}
