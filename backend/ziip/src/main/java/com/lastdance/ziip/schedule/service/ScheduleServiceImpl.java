package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleListDetailResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleListResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleRegisterResponseDto;
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
public class ScheduleServiceImpl implements ScheduleService{

    private final FamilyRepository familyRepository;
    private final ScheduleRepository scheduleRepository;
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

}
