package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.response.CalenderYearPlanResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalenderYearResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalenderYearScheduleResponseDto;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.QSchedule;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.lastdance.ziip.schedule.repository.entity.QSchedule.schedule;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CalenderServiceImpl implements CalenderService {

    private final ScheduleRepository scheduleRepository;
    private final JPAQueryFactory jpaQueryFactory;
    private final PlanRepository planRepository;

    public CalenderYearResponseDto yearCalender(Member findMember, int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        QSchedule qSchedule = QSchedule.schedule;

        List<Schedule> schedules = jpaQueryFactory
                .selectFrom(qSchedule)
                .where(qSchedule.startDate.between(startOfYear, endOfYear))
                .fetch();

        List<CalenderYearScheduleResponseDto> calenderYearScheduleResponseDtos = schedules.stream()
                .map(schedule -> toDto(schedule))
                .collect(Collectors.toList());

        CalenderYearResponseDto calenderYearResponseDto = CalenderYearResponseDto.builder()
                .calenderYearScheduleResponseDtoList(calenderYearScheduleResponseDtos)
                .build();

        return calenderYearResponseDto;
    }


    private CalenderYearScheduleResponseDto toDto(Schedule schedule) {

        List<CalenderYearPlanResponseDto> calenderYearPlanResponseDtoList = schedule.getPlans()
                .stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());

        return CalenderYearScheduleResponseDto.builder()
                .scheduleId(schedule.getId())
                .familyId(schedule.getFamily().getId())
                .memberId(schedule.getMember().getId())
                .title(schedule.getTitle())
                .startDate(schedule.getStartDate().toString())
                .endDate(schedule.getEndDate().toString())
                .calenderYearPlanResponseDtoList(calenderYearPlanResponseDtoList)
                .build();
    }

    private CalenderYearPlanResponseDto toPlanDto(Plan plan) {
        return CalenderYearPlanResponseDto.builder()
                .planId(plan.getId())
                .memberId(plan.getMember().getId())
                .statusCode(plan.getStatusCode().getId())
                .title(plan.getTitle())
                .content(plan.getContent())
                .build();
    }


}
