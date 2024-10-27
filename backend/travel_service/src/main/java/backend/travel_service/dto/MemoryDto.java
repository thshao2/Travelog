package backend.travel_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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