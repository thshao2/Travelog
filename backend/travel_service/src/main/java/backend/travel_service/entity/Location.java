package backend.travel_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	// do we need a name? if not what other fields
    @Column(nullable = false)
    private String name; // Name of the location


	// not expanding on location fields yet, research how to integrate w/ postgis and map api then change
    @Column(nullable = false)
    private Double latitude; // Latitude of the location

    @Column(nullable = false)
    private Double longitude; // Longitude of the location


}
