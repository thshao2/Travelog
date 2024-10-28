package backend.travel_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemoryDto {
    private String title;
    private String category;
    private String loc;
    private String captionText;
    private LocalDateTime initDate;
    private LocalDateTime endDate;
}
