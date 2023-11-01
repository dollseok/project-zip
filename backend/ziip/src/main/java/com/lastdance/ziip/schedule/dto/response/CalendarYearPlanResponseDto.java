package com.lastdance.ziip.schedule.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalendarYearPlanResponseDto {

    private Long planId;
    private Long memberId;
    private Long statusCode;
    private String title;
    private String content;
}
