package com.lastdance.ziip.plan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanStatusModifyRequestDto {
    private Long planId;
    private Long code;
}
