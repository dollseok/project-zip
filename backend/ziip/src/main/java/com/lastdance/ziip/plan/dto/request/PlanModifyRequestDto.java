package com.lastdance.ziip.plan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlanModifyRequestDto {
    Long planId;
    Long memberId;
    String title;
}
