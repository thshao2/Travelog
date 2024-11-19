package backend.travel_service.service;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.travel_service.entity.Location;
import backend.travel_service.entity.Pin;
import backend.travel_service.repository.LocationRepository;
import backend.travel_service.repository.MemoryRepository;
import backend.travel_service.repository.PinRepository;

@Service
public class PinService {
    @Autowired
    private PinRepository pinRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private MemoryRepository memoryRepository;

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

    public void deletePinById(Long pinId) {
        if (pinRepository.existsById(pinId)) {
            // Delete pin object
            pinRepository.deleteById(pinId);

            // Deassociate all memories with this pin
            memoryRepository.updateMemoriesPinIdToNull(pinId);

            System.out.println("Pin with ID " + pinId + " was deleted successfully.");
        } else {
            System.out.println("Pin with ID " + pinId + " does not exist.");
        }
    }

    public List<Double> getCoordinatesById(Long pinId) {
        List<Double> coordinates = new ArrayList<>();

        if (pinRepository.existsById(pinId)) {
            // get pin
            Pin pin = pinRepository.findById(pinId).orElse(null);
    
            // check if pin exists, get loc
            if (pin != null && pin.getLocation() != null) {
                // put lat and long into coordinates array
                Double latitude = pin.getLocation().getLatitude();
                Double longitude = pin.getLocation().getLongitude();
    
                coordinates.add(latitude);
                coordinates.add(longitude);
                System.out.println("IN GETCOORDINATES - PIN SERVICE" + latitude + " " + longitude);
            }
        }
        System.out.println("--> coordinates is " + coordinates);
        return coordinates;
    }
}
