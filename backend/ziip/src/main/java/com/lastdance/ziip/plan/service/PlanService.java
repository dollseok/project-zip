package com.lastdance.ziip.plan.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.dto.request.PlanWriteRequestDto;
import com.lastdance.ziip.plan.dto.response.PlanWriteResponseDto;

public interface PlanService {
    PlanWriteResponseDto postPlan(Member member, PlanWriteRequestDto planWriteRequestDto);
}
