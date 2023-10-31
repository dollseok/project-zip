package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.diary.repository.DiaryRepository;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.CalenderDayRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.QSchedule;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.DateFormatter;
import java.text.DateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final DiaryRepository diaryRepository;

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

    @Override
    public CalenderDayResponseDto dayCalender(Member findMember, CalenderDayRequestDto calenderDayRequestDto) {
        String[] datePart = calenderDayRequestDto.getTodayDate().split("-");

        String year = datePart[0];
        String month = datePart[1];
        String day = datePart[2];

        List<Schedule> schedule = scheduleRepository.findAllByStartDate(calenderDayRequestDto.getTodayDateAsLocalDate());
        List<CalenderDayScheduleResponseDto> calenderDayScheduleResponseDtoList = new ArrayList<>();

        // 해당하는 날짜의 스케줄 조회
        for (Schedule schedule1 : schedule) {
            List<Plan> plans = planRepository.findAllBySchedule(Optional.ofNullable(schedule1));

            // 해당하는 스케줄의 플랜 조회
            for (Plan plan : plans) {
            CalenderDayScheduleResponseDto calenderDayScheduleResponseDto = CalenderDayScheduleResponseDto.builder()
                    .planId(plan.getId())
                    .name(plan.getTitle())
                    .build();

            calenderDayScheduleResponseDtoList.add(calenderDayScheduleResponseDto);
            }
        }

        // 해당 일자의 다이어리 조회
        LocalDate inputDate = LocalDate.parse(calenderDayRequestDto.getTodayDate());
        LocalDateTime startOfDay = inputDate.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        //List<Diary> diaries = diaryRepository.findAllByCreatedAtBetween(startOfDay, endOfDay);






        CalenderDayResponseDto calenderDayResponseDto = CalenderDayResponseDto.builder()
                .calenderDayScheduleResponseDtoList(calenderDayScheduleResponseDtoList)
                .build();

        return calenderDayResponseDto;
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
