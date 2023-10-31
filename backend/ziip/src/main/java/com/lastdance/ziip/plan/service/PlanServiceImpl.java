package com.lastdance.ziip.plan.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.dto.request.PlanWriteRequestDto;
import com.lastdance.ziip.plan.dto.response.PlanDetailResponseDto;
import com.lastdance.ziip.plan.dto.response.PlanWriteResponseDto;
import com.lastdance.ziip.plan.enums.Code;
import com.lastdance.ziip.plan.enums.Status;
import com.lastdance.ziip.plan.exception.validator.PlanValidator;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.StatusCodeRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.plan.repository.entity.StatusCode;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PlanServiceImpl implements PlanService{

    private final PlanRepository planRepository;
    private final ScheduleRepository scheduleRepository;
    private final StatusCodeRepository statusCodeRepository;
    private final PlanValidator planValidator;

    @Override
    public PlanWriteResponseDto postPlan(Member member, PlanWriteRequestDto planWriteRequestDto) {

        Optional<Schedule> schedule = scheduleRepository.findById(planWriteRequestDto.getScheduleId());
        StatusCode statusCode = statusCodeRepository.findByCode(Code.Pending);

        Plan plan = Plan.builder()
                .schedule(schedule.get())
                .member(member)
                .statusCode(statusCode)
                .title(planWriteRequestDto.getTitle())
                .content(planWriteRequestDto.getContent())
                .build();

        Plan savedPlan = planRepository.save(plan);

        PlanWriteResponseDto planWriteResponseDto = PlanWriteResponseDto.builder()
                .planId(savedPlan.getId())
                .build();

        return planWriteResponseDto;
    }

    @Override
    public PlanDetailResponseDto getPlanDetail(Member member, Long planId) {

        Optional<Plan> tmpPlan = planRepository.findById(planId);

        planValidator.checkPlanExist(tmpPlan);

        Plan plan = tmpPlan.get();

        PlanDetailResponseDto planDetailResponseDto = PlanDetailResponseDto.builder()
                .planId(planId)
                .memberId(plan.getMember().getId())
                .content(plan.getContent())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();

        return planDetailResponseDto;
    }
}
