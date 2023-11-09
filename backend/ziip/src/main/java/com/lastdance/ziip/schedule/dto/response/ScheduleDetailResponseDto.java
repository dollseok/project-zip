package com.lastdance.ziip.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleDetailResponseDto {

    private String title;
    private String startDate;
    private String endDate;
    private List<ScheduleDetailPlanResponseDto> plans;
    private List<ScheduleDetailPhotoResponseDto> photos;

}
