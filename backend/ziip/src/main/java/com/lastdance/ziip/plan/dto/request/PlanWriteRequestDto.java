package com.lastdance.ziip.plan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlanWriteRequestDto {
    private Long scheduleId;
    private Long memberId;
    private String title;
}
