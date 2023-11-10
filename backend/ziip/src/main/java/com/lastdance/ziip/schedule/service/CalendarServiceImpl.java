package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.diary.repository.DiaryCommentRepository;
import com.lastdance.ziip.diary.repository.DiaryRepository;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.CalendarDayRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.QSchedule;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CalendarServiceImpl implements CalendarService {

    private final ScheduleRepository scheduleRepository;
    private final JPAQueryFactory jpaQueryFactory;
    private final PlanRepository planRepository;
    private final DiaryRepository diaryRepository;
    private final DiaryCommentRepository diaryCommentRepository;

    @Override
    public CalendarYearResponseDto yearCalendar(Member findMember, int year, Long familyId) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        QSchedule qSchedule = QSchedule.schedule;

        List<Schedule> schedules = jpaQueryFactory
                .selectFrom(qSchedule)
                .where(qSchedule.family.id.eq(familyId)
                                .and(qSchedule.startDate.between(startOfYear, endOfYear)
                                                .or(qSchedule.endDate.between(startOfYear, endOfYear)))
                )
                .fetch();

        List<CalendarYearScheduleResponseDto> calendarYearScheduleResponseDtos = schedules.stream()
                .map(schedule -> toDto(schedule))
                .collect(Collectors.toList());

        CalendarYearResponseDto calendarYearResponseDto = CalendarYearResponseDto.builder()
                .calendarYearScheduleResponseDtoList(calendarYearScheduleResponseDtos)
                .build();

        return calendarYearResponseDto;
    }

    @Override
    public CalendarDayResponseDto dayCalendar(Member findMember, String todayDate, Long familyId) {
        // 해당하는 날짜의 스케줄 조회 및 스케줄의 플랜 조회
        List<CalendarDayScheduleResponseDto> calendarDayScheduleResponseDtoList =
                scheduleRepository.findAllByStartDateBeforeAndEndDateAfterAndFamilyId(
                                getTodayDateAsLocalDate(todayDate), getTodayDateAsLocalDate(todayDate), familyId)
                        .stream()
                        .map(schedule -> {
                            List<Plan> plans = planRepository.findAllBySchedule(schedule);
                            List<CalendarDayPlanResponseDto> planDtos = plans.stream()
                                    .map(plan -> CalendarDayPlanResponseDto.builder()
                                            .planId(plan.getId())
                                            .name(plan.getTitle())
                                            .build())
                                    .collect(Collectors.toList());

                            CalendarDayScheduleResponseDto scheduleDto = CalendarDayScheduleResponseDto.builder()
                                    .scheduleId(schedule.getId())
                                    .familyId(schedule.getFamily().getId())
                                    .memberId(schedule.getMember().getId())
                                    .title(schedule.getTitle())
                                    .startDate(schedule.getStartDate().toString())
                                    .endDate(schedule.getEndDate().toString())
                                    .calendarDayPlanResponseDto(planDtos)
                                    .build();

                            return scheduleDto;
                        })
                        .collect(Collectors.toList());

        LocalDate inputDate = LocalDate.parse(todayDate);
        LocalDateTime startOfDay = inputDate.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // 해당 일자의 다이어리 조회 및 다이어리의 코멘트 조회
        List<CalendarDayDiaryResponseDto> calendarDayDiaryResponseDtos =
                diaryRepository.findAllByCreatedAtBetweenAndFamilyId(startOfDay, endOfDay, familyId)
                        .stream()
                        .map(diary -> {
                            List<CalendarDayCommentResponseDto> calendarDayCommentResponseDtoList =
                                    diaryCommentRepository.findAllByDiary(diary)
                                            .stream()
                                            .map(diaryComment -> CalendarDayCommentResponseDto.builder()
                                                    .memberId(diaryComment.getMember().getId())
                                                    .profileImgUrl(diaryComment.getMember().getProfileImgUrl())
                                                    .content(diaryComment.getContent())
                                                    .build())
                                            .collect(Collectors.toList());

                            return CalendarDayDiaryResponseDto.builder()
                                    .diaryId(diary.getId())
                                    .memberId(diary.getMember().getId())
                                    .memberName(diary.getMember().getName())
                                    .title(diary.getTitle())
                                    .content(diary.getContent())
                                    .calendarDayCommentResponseDtoList(calendarDayCommentResponseDtoList)
                                    .build();
                        })
                        .collect(Collectors.toList());

        CalendarDayResponseDto calendarDayResponseDto = CalendarDayResponseDto.builder()
                .calendarDayScheduleResponseDtoList(calendarDayScheduleResponseDtoList)
                .calendarDayDiaryResponseDtos(calendarDayDiaryResponseDtos)
                .build();

        return calendarDayResponseDto;

    }


    @Override
    public CalendarMonthResponseDto monthCalendar(Member findMember, int year, int month, Long familyId) {
        // 해당 월의 시작 날짜와 마지막 날짜 계산
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);

        // 해당 월의 스케줄 조회 및 스케줄의 플랜 조회
        List<CalendarMonthScheduleResponseDto> calendarMonthScheduleResponseDtoList =
                scheduleRepository.findAllByStartDateBeforeAndEndDateAfterAndFamilyId(
                                endOfMonth, startOfMonth, familyId)
                        .stream()
                        .map(schedule -> {
                            List<Plan> plans = planRepository.findAllBySchedule(schedule);
                            List<CalendarMonthPlanScheduleResponseDto> planDtos = plans.stream()
                                    .map(plan -> CalendarMonthPlanScheduleResponseDto.builder()
                                            .planId(plan.getId())
                                            .name(plan.getTitle())
                                            .build())
                                    .collect(Collectors.toList());

                            CalendarMonthScheduleResponseDto scheduleDto = CalendarMonthScheduleResponseDto.builder()
                                    .scheduleId(schedule.getId())
                                    .familyId(schedule.getFamily().getId())
                                    .memberId(schedule.getMember().getId())
                                    .title(schedule.getTitle())
                                    .startDate(schedule.getStartDate().toString())
                                    .endDate(schedule.getEndDate().toString())
                                    .calendarMonthPlanScheduleResponseDtoList(planDtos)
                                    .build();

                            return scheduleDto;
                        })
                        .collect(Collectors.toList());

        // 해당 월의 다이어리 조회 및 다이어리의 코멘트 조회
        List<CalendarMonthDiaryResponseDto> calendarMonthDiaryResponseDtos =
                diaryRepository.findAllByCreatedAtBetweenAndFamilyId(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59), familyId)
                        .stream()
                        .map(diary -> {
                            List<CalendarMonthCommentResponseDto> calendarMonthCommentResponseDtoList =
                                    diaryCommentRepository.findAllByDiary(diary)
                                            .stream()
                                            .map(diaryComment -> CalendarMonthCommentResponseDto.builder()
                                                    .memberId(diaryComment.getMember().getId())
                                                    .profileImgUrl(diaryComment.getMember().getProfileImgUrl())
                                                    .content(diaryComment.getContent())
                                                    .build())
                                            .collect(Collectors.toList());

                            return CalendarMonthDiaryResponseDto.builder()
                                    .diaryId(diary.getId())
                                    .memberId(diary.getMember().getId())
                                    .memberName(diary.getMember().getName())
                                    .title(diary.getTitle())
                                    .content(diary.getContent())
                                    .calendarMonthCommentResponseDtoList(calendarMonthCommentResponseDtoList)
                                    .build();
                        })
                        .collect(Collectors.toList());

        // Build response
        CalendarMonthResponseDto calendarMonthResponseDto = CalendarMonthResponseDto.builder()
                .calendarMonthScheduleResponseDtoList(calendarMonthScheduleResponseDtoList)
                .calendarMonthDiaryResponseDtos(calendarMonthDiaryResponseDtos)
                .build();

        return calendarMonthResponseDto;
    }

    private CalendarYearScheduleResponseDto toDto(Schedule schedule) {

        List<CalendarYearPlanResponseDto> calendarYearPlanResponseDtoList = schedule.getPlans()
                .stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());

        return CalendarYearScheduleResponseDto.builder()
                .scheduleId(schedule.getId())
                .familyId(schedule.getFamily().getId())
                .memberId(schedule.getMember().getId())
                .title(schedule.getTitle())
                .startDate(schedule.getStartDate().toString())
                .endDate(schedule.getEndDate().toString())
                .calendarYearPlanResponseDtoList(calendarYearPlanResponseDtoList)
                .build();
    }

    private CalendarYearPlanResponseDto toPlanDto(Plan plan) {
        return CalendarYearPlanResponseDto.builder()
                .planId(plan.getId())
                .memberId(plan.getMember().getId())
                .statusCode(plan.getStatusCode().getId())
                .title(plan.getTitle())
                .build();
    }

    public LocalDate getTodayDateAsLocalDate(String todayDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(todayDate, formatter);
    }


}
