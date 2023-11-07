package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.ScheduleDeleteRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleModifyRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.Schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final FamilyRepository familyRepository;
    private final ScheduleRepository scheduleRepository;
    private final PlanRepository planRepository;

    @Override
    public ScheduleRegisterResponseDto registerSchedule(Member findMember,
                                                        ScheduleRegisterRequestDto scheduleRegisterRequestDto) {

        System.out.println(scheduleRegisterRequestDto.getFamilyId());
        Optional<Family> family = familyRepository.findById(scheduleRegisterRequestDto.getFamilyId());

        Schedule schedule = Schedule.builder()
                .family(family.get())
                .member(findMember)
                .title(scheduleRegisterRequestDto.getTitle())
                .startDate(LocalDate.parse(scheduleRegisterRequestDto.getStartDate()))
                .endDate(LocalDate.parse(scheduleRegisterRequestDto.getEndDate()))
                .build();

        Schedule saveSchedule = scheduleRepository.save(schedule);

        ScheduleRegisterResponseDto scheduleRegisterResponseDto = ScheduleRegisterResponseDto.builder()
                .scheduleId(saveSchedule.getId())
                .build();

        return scheduleRegisterResponseDto;
    }

    @Override
    public ScheduleListResponseDto listSchedule(Member findMember, long familyId) {
        Optional<Family> family = familyRepository.findById(familyId);

        List<Schedule> schedules = scheduleRepository.findAllByFamily(
                Optional.ofNullable(family.orElse(null))); // handle the Optional properly

        List<ScheduleListDetailResponseDto> scheduleListDetailResponseDtos = schedules.stream()
                .map(schedule -> ScheduleListDetailResponseDto.builder()
                        .scheduleId(schedule.getId())
                        .memberId(findMember.getId())
                        .name(schedule.getTitle())
                        .startDate(String.valueOf(schedule.getStartDate()))
                        .endDate(String.valueOf(schedule.getEndDate()))
                        .build())
                .collect(Collectors.toList());

        return ScheduleListResponseDto.builder()
                .scheduleListDetailResponseList(scheduleListDetailResponseDtos)
                .build();
    }

    @Override
    public ScheduleDetailResponseDto detailSchedule(Member findMember, long scheduleId) {

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 스케줄을 찾을 수 없습니다. id번호 : " + scheduleId));

        List<ScheduleDetailPlanResponseDto> scheduleDetailPlanResponseDtos =
                planRepository.findAllBySchedule(Optional.of(schedule)).stream()
                        .map(plan -> ScheduleDetailPlanResponseDto.builder()
                                .planId(plan.getId())
                                .memberId(plan.getMember().getId())
                                .statusCode(Long.valueOf(plan.getStatusCode().getCode().getValue()))
                                .title(plan.getTitle())
                                .build())
                        .collect(Collectors.toList());

        ScheduleDetailResponseDto scheduleDetailResponseDto = ScheduleDetailResponseDto.builder()
                .title(schedule.getTitle())
                .startDate(String.valueOf(schedule.getStartDate()))
                .endDate(String.valueOf(schedule.getEndDate()))
                .scheduleDetailPlanResponseDtos(scheduleDetailPlanResponseDtos)
                .build();

        return scheduleDetailResponseDto;
    }

    @Override
    public ScheduleModifyResponseDto modifySchedule(Member findMember, ScheduleModifyRequestDto scheduleModifyRequestDto) {

        Optional<Schedule> schedule = scheduleRepository.findById(scheduleModifyRequestDto.getScheduleId());

        schedule.get().update(scheduleModifyRequestDto);

        scheduleRepository.save(schedule.get());

        ScheduleModifyResponseDto scheduleModifyResponseDto = ScheduleModifyResponseDto.builder()
                .scheduleId(scheduleModifyRequestDto.getScheduleId())
                .build();

        return scheduleModifyResponseDto;
    }

    @Override
    public ScheduleDeleteResponseDto deleteService(Member findMember, ScheduleDeleteRequestDto scheduleDeleteRequestDto) {

        Schedule schedule = scheduleRepository.findById(scheduleDeleteRequestDto.getScheduleId())
                .orElseThrow(() -> new IllegalArgumentException("해당하는 스케줄을 찾을 수 없습니다. id번호 : " + scheduleDeleteRequestDto.getScheduleId()));


        planRepository.findAllBySchedule(Optional.of(schedule)).stream()
                .forEach(planRepository::delete);

        scheduleRepository.delete(schedule);

        ScheduleDeleteResponseDto scheduleDeleteResponseDto = ScheduleDeleteResponseDto.builder()
                .memberId(findMember.getId())
                .build();

        return scheduleDeleteResponseDto;
    }

}
