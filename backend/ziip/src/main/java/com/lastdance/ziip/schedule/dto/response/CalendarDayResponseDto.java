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
public class CalendarDayResponseDto {

    private List<CalendarDayScheduleResponseDto> calendarDayScheduleResponseDtoList;
    private List<CalendarDayDiaryResponseDto> calendarDayDiaryResponseDtos;
}
