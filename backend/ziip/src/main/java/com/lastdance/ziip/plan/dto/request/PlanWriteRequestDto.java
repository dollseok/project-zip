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
    private long scheduleId;
    private long memberId;
    private String title;
    private String content;
}
