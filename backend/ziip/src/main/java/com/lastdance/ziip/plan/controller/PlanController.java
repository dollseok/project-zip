package com.lastdance.ziip.plan.controller;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.plan.dto.request.PlanModifyRequestDto;
import com.lastdance.ziip.plan.dto.request.PlanWriteRequestDto;
import com.lastdance.ziip.plan.dto.response.PlanDetailResponseDto;
import com.lastdance.ziip.plan.dto.response.PlanModifyResponseDto;
import com.lastdance.ziip.plan.dto.response.PlanWriteResponseDto;
import com.lastdance.ziip.plan.enums.PlanResponseMessage;
import com.lastdance.ziip.plan.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

@Tag(name = "Plan", description = "계획 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/plan")
public class PlanController {

    private final PlanService planService;
    private final MemberService memberService;

    @Operation(summary = "계획 등록", description = "계획 등록 API")
    @PostMapping("/write")
    public ResponseEntity<ResponseTemplate<PlanWriteResponseDto>> postPlan(
            HttpServletRequest httpServletRequest,
            @RequestBody PlanWriteRequestDto planWriteRequestDto){

        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member member = memberService.findMemberByJwtToken(token);

        PlanWriteResponseDto responseDto = planService.postPlan(member, planWriteRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<PlanWriteResponseDto>builder()
                        .msg(PlanResponseMessage.PLAN_REGIST_SUCCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "계획 상세 조회", description = "계획 상세 조회 API")
    @GetMapping("/detail")
    public ResponseEntity<ResponseTemplate<PlanDetailResponseDto>> getPlanDetail(HttpServletRequest httpServletRequest,
                                                            @RequestParam(name = "planId") long planId){
        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member member = memberService.findMemberByJwtToken(token);

        PlanDetailResponseDto responseDto = planService.getPlanDetail(member, planId);

        return new ResponseEntity<>(
                ResponseTemplate.<PlanDetailResponseDto> builder()
                        .msg(PlanResponseMessage.PLAN_DETAIL_SUCCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "계획 수정", description = "계획 수정 API")
    @PutMapping("/modify")
    public ResponseEntity<ResponseTemplate<PlanModifyResponseDto>> modifyPlan(HttpServletRequest httpServletRequest,
                                                                              @RequestBody PlanModifyRequestDto planModifyRequestDto){

        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member member = memberService.findMemberByJwtToken(token);

        PlanModifyResponseDto responseDto = planService.modifyPlan(member, planModifyRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<PlanModifyResponseDto> builder()
                        .msg(PlanResponseMessage.PLAN_MODIFY_SUCCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);

    }
}
