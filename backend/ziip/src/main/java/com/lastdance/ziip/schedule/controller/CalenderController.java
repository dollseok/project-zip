package com.lastdance.ziip.schedule.controller;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.schedule.dto.response.CalenderYearResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleRegisterResponseDto;
import com.lastdance.ziip.schedule.enums.CalenderResponseMessage;
import com.lastdance.ziip.schedule.enums.ScheduleResponseMessage;
import com.lastdance.ziip.schedule.service.CalenderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

@Tag(name = "Calender", description = "캘린더 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/calender")
public class CalenderController {

    private final MemberService memberService;
    private final CalenderService calenderService;

    @Operation(summary = "년도별 이슈 조회", description = "년도별 이슈 조회 API")
    @GetMapping("/year")
    public ResponseEntity<ResponseTemplate<CalenderYearResponseDto>> yearCalender(HttpServletRequest httpServletRequest, @RequestParam(name = "year") int year){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        CalenderYearResponseDto calenderYearResponseDto = calenderService.yearCalender(findMember, year);

        return new ResponseEntity<>(
                ResponseTemplate.<CalenderYearResponseDto>builder()
                        .msg(year + CalenderResponseMessage.CALENDER_YEAR_SUCCESS.getMessage())
                        .data(calenderYearResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }
}
