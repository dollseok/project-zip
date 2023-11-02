package com.lastdance.ziip.plan.service;

import com.lastdance.ziip.member.exception.validator.MemberCheckValidator;
import com.lastdance.ziip.member.repository.MemberRepository;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.dto.request.PlanDeleteRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanModifyRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanStatusModifyRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanWriteRequestDto;
import com.lastdance.ziip.plan.dto.response.*;
import com.lastdance.ziip.plan.enums.Code;
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
    private final MemberRepository memberRepository;

    private final PlanValidator planValidator;
    private final MemberCheckValidator memberValidator;

    @Override
    public PlanWriteResponseDto postPlan(Member member, PlanWriteRequestDto planWriteRequestDto) {

        Optional<Schedule> schedule = scheduleRepository.findById(planWriteRequestDto.getScheduleId());
        StatusCode statusCode = statusCodeRepository.findByCode(Code.Pending);

        Plan plan = Plan.builder()
                .schedule(schedule.get())
                .member(member)
                .statusCode(statusCode)
                .title(planWriteRequestDto.getTitle())
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
//                .content(plan.getContent())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();

        return planDetailResponseDto;
    }

    @Override
    public PlanModifyResponseDto modifyPlan(Member member, PlanModifyRequestDto planModifyRequestDto) {

        Optional<Plan> tmpPlan = planRepository.findById(planModifyRequestDto.getPlanId());
        planValidator.checkPlanExist(tmpPlan);

        Optional<Member> tmpMember = memberRepository.findById(planModifyRequestDto.getMemberId());
        memberValidator.checkMemberExist(tmpMember);

        tmpPlan.get().update(planModifyRequestDto, tmpMember.get());
        Plan plan = tmpPlan.get();

        planRepository.save(plan);

        PlanModifyResponseDto planModifyResponseDto = PlanModifyResponseDto.builder()
                .planId(planModifyRequestDto.getPlanId())
                .build();

        return planModifyResponseDto;
    }

    @Override
    public PlanDeleteResponseDto deletePlan(Member member, PlanDeleteRequestDto planDeleteRequestDto) {

        Optional<Plan> tmpPlan = planRepository.findById(planDeleteRequestDto.getPlanId());
        planValidator.checkPlanExist(tmpPlan);
        Plan plan = tmpPlan.get();

        planValidator.checkPlanManager(plan, member.getId());

        planRepository.delete(plan);

        PlanDeleteResponseDto planDeleteResponseDto = PlanDeleteResponseDto.builder()
                .memberId(member.getId())
                .build();

        return planDeleteResponseDto;
    }

    @Override
    public PlanStatusModifyResponseDto modifyPlanStatus(Member member, PlanStatusModifyRequestDto planStatusModifyRequestDto) {

        Optional<Plan> tmpPlan = planRepository.findById(planStatusModifyRequestDto.getPlanId());
        planValidator.checkPlanExist(tmpPlan);
        Plan plan = tmpPlan.get();

        StatusCode statusCode = null;
        long code = planStatusModifyRequestDto.getCode();

        if(code == 0) statusCode = statusCodeRepository.findByCode(Code.Pending);
        else if(code == 1) statusCode = statusCodeRepository.findByCode(Code.InProgress);
        else if(code == 2) statusCode = statusCodeRepository.findByCode(Code.Completed);

        plan.updateStatusCode(statusCode);

        planRepository.save(plan);

        PlanStatusModifyResponseDto planStatusModifyResponseDto = PlanStatusModifyResponseDto.builder()
                .planId(planStatusModifyRequestDto.getPlanId())
                .build();

        return planStatusModifyResponseDto;
    }


}
