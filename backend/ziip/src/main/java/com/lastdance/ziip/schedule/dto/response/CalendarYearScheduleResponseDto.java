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
public class CalendarYearScheduleResponseDto {

    private Long scheduleId;
    private Long familyId;
    private Long memberId;
    private String title;
    private String startDate;
    private String endDate;
    private List<CalendarYearPlanResponseDto> calendarYearPlanResponseDtoList;
}
