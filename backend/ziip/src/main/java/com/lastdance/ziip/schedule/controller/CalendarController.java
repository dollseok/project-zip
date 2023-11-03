package com.lastdance.ziip.schedule.controller;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.schedule.dto.request.CalendarDayRequestDto;
import com.lastdance.ziip.schedule.dto.response.CalendarDayResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalendarMonthResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalendarYearResponseDto;
import com.lastdance.ziip.schedule.enums.CalendarResponseMessage;
import com.lastdance.ziip.schedule.service.CalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

@Tag(name = "Calendar", description = "캘린더 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/calendar")
public class CalendarController {

    private final MemberService memberService;
    private final CalendarService calendarService;

    @Operation(summary = "년도별 이슈 조회", description = "년도별 이슈 조회 API")
    @GetMapping("/year")
    public ResponseEntity<ResponseTemplate<CalendarYearResponseDto>> yearCalendar(HttpServletRequest httpServletRequest, @RequestParam(name = "year") int year) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        CalendarYearResponseDto calendarYearResponseDto = calendarService.yearCalendar(findMember, year);

        return new ResponseEntity<>(
                ResponseTemplate.<CalendarYearResponseDto>builder()
                        .msg(year + CalendarResponseMessage.CALENDAR_YEAR_SUCCESS.getMessage())
                        .data(calendarYearResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "날짜 일정 조회", description = "날짜별 일정 , 계획 조회 API")
    @GetMapping("/day")
    public ResponseEntity<ResponseTemplate<CalendarDayResponseDto>> dayCalendar(HttpServletRequest httpServletRequest, @RequestParam(name = "todayDate") String todayDate ) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        CalendarDayResponseDto calendarDayResponseDto = calendarService.dayCalendar(findMember, todayDate);

        String[] datePart = todayDate.split("-");

        String year = datePart[0];
        String month = datePart[1];
        String day = datePart[2];


        return new ResponseEntity<>(
                ResponseTemplate.<CalendarDayResponseDto>builder()
                        .msg(year + "년" + month + "월" + day + CalendarResponseMessage.CALENDAR_DAY_SUCCESS.getMessage())
                        .data(calendarDayResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "월별 일정 조회", description = "월별 일정 , 계획, 일기 조회 API")
    @GetMapping("/month")
    public ResponseEntity<ResponseTemplate<CalendarMonthResponseDto>> monthCalendar(HttpServletRequest httpServletRequest, @RequestParam(name = "year") int year, @RequestParam(name = "month") int month) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        CalendarMonthResponseDto calendarMonthResponseDto = calendarService.monthCalendar(findMember, year, month);



        return new ResponseEntity<>(
                ResponseTemplate.<CalendarMonthResponseDto>builder()
                        .msg(year + "년" + month + "월" + " " +  CalendarResponseMessage.CALENDAR_MONTH_SUCCESS.getMessage())
                        .data(calendarMonthResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }


}
