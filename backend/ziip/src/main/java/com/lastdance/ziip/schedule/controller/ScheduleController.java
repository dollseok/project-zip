package com.lastdance.ziip.schedule.controller;

import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.family.enums.FamilyResponseMessage;
import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

}
