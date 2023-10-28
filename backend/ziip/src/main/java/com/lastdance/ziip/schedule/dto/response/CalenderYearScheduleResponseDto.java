package com.lastdance.ziip.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalenderYearScheduleResponseDto {

    private Long ScheduleId;
    private Long familyId;
    private Long memberId;
    private String title;
    private String startDate;
    private String endDate;
    private
}
