package com.lastdance.ziip.schedule.controller;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleDetailResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleListResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleRegisterResponseDto;
import com.lastdance.ziip.schedule.enums.ScheduleResponseMessage;
import com.lastdance.ziip.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Tag(name = "Schedule", description = "스케줄 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final MemberService memberService;
    private final ScheduleService scheduleService;

    @Operation(summary = "일정 등록", description = "일정 등록 API")
    @PostMapping("/register")
    public ResponseEntity<ResponseTemplate<ScheduleRegisterResponseDto>> registerSchedule(
            HttpServletRequest httpServletRequest,
            @RequestBody ScheduleRegisterRequestDto scheduleRegisterRequestDto) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleRegisterResponseDto scheduleRegisterResponseDto = scheduleService.registerSchedule(
                findMember, scheduleRegisterRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<ScheduleRegisterResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_REGIST_SUCCESS.getMessage())
                        .data(scheduleRegisterResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "일정 리스트 조회", description = "일정 리스트 조회 API")
    @GetMapping("/list")
    public ResponseEntity<ResponseTemplate<ScheduleListResponseDto>> listSchedule(
            HttpServletRequest httpServletRequest, @RequestParam(name = "familyId") long familyId) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleListResponseDto scheduleListResponse = scheduleService.listSchedule(findMember, familyId);

        return new ResponseEntity<>(
                ResponseTemplate.<ScheduleListResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_LIST_SUCCESS.getMessage())
                        .data(scheduleListResponse)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "일정 상세 조회", description = "일정 상세 조회 API")
    @GetMapping("/detail")
    public ResponseEntity<ResponseTemplate<ScheduleDetailResponseDto>> DetailSchedule(HttpServletRequest httpServletRequest,
                                                                                      @RequestParam(name = "scheduleId") long scheduleId) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleDetailResponseDto scheduleDetailResponse = scheduleService.detailSchedule(findMember, scheduleId);

        return new ResponseEntity<>(
                ResponseTemplate.<ScheduleDetailResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_DETAIL_SUCCESS.getMessage())
                        .data(scheduleDetailResponse)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

}
