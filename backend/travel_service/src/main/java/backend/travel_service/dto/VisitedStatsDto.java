package backend.travel_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VisitedStatsDto {
    private int visitedContinentCount;
    private int visitedCountryCount;
    private int visitedCityCount;
    private String defaultLocation;
}
