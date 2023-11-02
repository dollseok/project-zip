package com.lastdance.ziip.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleDetailPlanResponseDto {

    private Long scheduleId;
    private Long memberId;
    private Long statusCode;
    private String title;
//    private String content;

}
