package com.lastdance.ziip.schedule.controller;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import com.lastdance.ziip.schedule.dto.request.ScheduleDeleteRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleModifyRequestDto;
import com.lastdance.ziip.schedule.dto.request.SchedulePhotoRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.enums.ScheduleResponseMessage;
import com.lastdance.ziip.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.List;

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

    @Operation(summary = "일정 수정", description = "일정 수정 API")
    @PutMapping("/modify")
    public ResponseEntity<ResponseTemplate<ScheduleModifyResponseDto>> modifySchedule(HttpServletRequest httpServletRequest, @RequestBody ScheduleModifyRequestDto scheduleModifyRequestDto) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleModifyResponseDto scheduleModifyResponseDto = scheduleService.modifySchedule(findMember, scheduleModifyRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<ScheduleModifyResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_MODIFY_SUCCESS.getMessage())
                        .data(scheduleModifyResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "일정 삭제", description = "일정 삭제 API(관련 상세계획 모두 삭제)")
    @DeleteMapping("/delete")
    public ResponseEntity<ResponseTemplate<ScheduleDeleteResponseDto>> deleteSchedule(HttpServletRequest httpServletRequest, @RequestBody ScheduleDeleteRequestDto scheduleDeleteRequestDto) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleDeleteResponseDto scheduleDeleteResponseDto = scheduleService.deleteService(findMember, scheduleDeleteRequestDto);
        return new ResponseEntity<>(
                ResponseTemplate.<ScheduleDeleteResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_DELETE_SUCCESS.getMessage())
                        .data(scheduleDeleteResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "일정 사진 등록", description = "일정 사진 등록")
    @PostMapping("/photo/register")
    public ResponseEntity<ResponseTemplate<SchedulePhotoRegisterResponseDto>> schedulePhotoRegister(
            HttpServletRequest httpServletRequest,
            @RequestPart(name = "dto") SchedulePhotoRegisterRequestDto requestDto,
            @RequestPart(name = "files") List<MultipartFile> files){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        SchedulePhotoRegisterResponseDto schedulePhotoRegisterResponseDto = scheduleService.registSchedulePhoto(findMember, files, requestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<SchedulePhotoRegisterResponseDto>builder()
                        .msg(ScheduleResponseMessage.SCHEDULE_PHOTO_REGIST_SUCCESS.getMessage())
                        .data(schedulePhotoRegisterResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK);
    }

    @Operation(summary = "일정 사진 삭제", description = "일정 사진 삭제 api")
    @DeleteMapping("/photo/delete")
    public ResponseEntity<ResponseTemplate<SchedulePhotoDeleteResponseDto>> deleteSchedulePhoto(
            HttpServletRequest httpServletRequest,
            @RequestParam(name = "schedulePhotoId") Long schedulePhotoId){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null){
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        SchedulePhotoDeleteResponseDto schedulePhotoDeleteResponseDto = scheduleService.deleteSchedulePhoto(findMember, schedulePhotoId);

        return new ResponseEntity<>(ResponseTemplate.<SchedulePhotoDeleteResponseDto>builder()
                .msg(ScheduleResponseMessage.SCHEDULE_PHOTO_DELETE_SUCCESS.getMessage())
                .result(true)
                .data(schedulePhotoDeleteResponseDto)
                .build(),HttpStatus.OK);
    }

    @Operation(summary = "내 일정 리스트 조회", description = "내 일정 리스트 조회 API")
    @GetMapping("/mylist")
    public ResponseEntity<ResponseTemplate<ScheduleListResponseDto>> listMySchedule(
        HttpServletRequest httpServletRequest, @RequestParam(name = "familyId") long familyId) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        ScheduleListResponseDto scheduleListResponse = scheduleService.listMySchedule(findMember, familyId);

        return new ResponseEntity<>(
            ResponseTemplate.<ScheduleListResponseDto>builder()
                .msg(ScheduleResponseMessage.SCHEDULE_LIST_SUCCESS.getMessage())
                .data(scheduleListResponse)
                .result(true)
                .build(),
            HttpStatus.OK);
    }
}
