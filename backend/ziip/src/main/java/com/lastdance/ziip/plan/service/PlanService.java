package com.lastdance.ziip.plan.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.dto.request.PlanDeleteRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanModifyRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanStatusModifyRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanWriteRequestDto;
import com.lastdance.ziip.plan.dto.response.*;

public interface PlanService {
    PlanWriteResponseDto postPlan(Member member, PlanWriteRequestDto planWriteRequestDto);
    PlanDetailResponseDto getPlanDetail(Member member, Long planId);
    PlanModifyResponseDto modifyPlan(Member member, PlanModifyRequestDto planModifyRequestDto);
    PlanDeleteResponseDto deletePlan(Member member, Long planId);
    PlanStatusModifyResponseDto modifyPlanStatus(Member member, PlanStatusModifyRequestDto planStatusModifyRequestDto);
}
