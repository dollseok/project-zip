package com.lastdance.ziip.family.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.lastdance.ziip.family.dto.request.*;
import com.lastdance.ziip.family.dto.response.*;
import com.lastdance.ziip.family.enums.FamilyResponseMessage;
import com.lastdance.ziip.family.exception.MemberAlreadyRegisteredInFamilyException;
import com.lastdance.ziip.family.service.FamilyService;
import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Tag(name = "Family", description = "가족 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/family")
public class FamilyController {

    private final FamilyService familyService;
    private final MemberService memberService;

    @Operation(summary = "가족 등록", description = "가족 등록하기 API(생성 시 초대코드 자동 생성)")
    @PostMapping("/register")
    public ResponseEntity<ResponseTemplate<FamilyRegisterResponseDto>> registFamily(
            HttpServletRequest httpServletRequest,
            @RequestPart(name = "familyRegisterRequest") String jsonString,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        FamilyRegisterRequestDto familyRegisterRequest = mapper.readValue(jsonString, FamilyRegisterRequestDto.class);

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        System.out.println("회원 정보 : " + familyRegisterRequest.toString());
        System.out.println("회원 이름 : " + findMember.getName());

        FamilyRegisterResponseDto familyRegisterResponseDto = familyService.registFamily(findMember,
                familyRegisterRequest, file);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyRegisterResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_REGIST_SUCCESS.getMessage())
                        .data(familyRegisterResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "가족 초대 수락", description = "초대코드로 가족 초대 수락하기 API")
    @PostMapping("/accept")
    public ResponseEntity<ResponseTemplate<FamilyRegisterAcceptResponseDto>> acceptFamily(
            HttpServletRequest httpServletRequest,
            @RequestBody FamilyRegisterAcceptRequestDto familyRegisterAcceptRequest) {
        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyRegisterAcceptResponseDto familyRegisterAcceptResponse = familyService.acceptFamily(
                findMember, familyRegisterAcceptRequest);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyRegisterAcceptResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_ACCEPT_SUCCESS.getMessage())
                        .data(familyRegisterAcceptResponse)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "가족 리스트 조회", description = "가입된 가족 리스트 조회 API")
    @GetMapping("/list")
    public ResponseEntity<ResponseTemplate<FamilyListResponseDto>> listFamily(
            HttpServletRequest httpServletRequest) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyListResponseDto familyListResponseDto = familyService.listFamily(findMember);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyListResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_LIST_SUCCESS.getMessage())
                        .data(familyListResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "닉네임 변경", description = "가족 내 닉네임 변경 API")
    @PutMapping("/nickname")
    public ResponseEntity<ResponseTemplate<FamilyNickNameResponseDto>> modifyNickname(
            HttpServletRequest httpServletRequest,
            @RequestBody FamilyNickNameRequestDto familyNickNameRequest) {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyNickNameResponseDto familyNickNameResponse = familyService.modifyNickname(findMember,
                familyNickNameRequest);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyNickNameResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_NICKNAME_SUCCESS.getMessage())
                        .data(familyNickNameResponse)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "가족 선택", description = "선택한 가족의 정보를 알려주는 API")
    @GetMapping("/choice")
    public ResponseEntity<ResponseTemplate<FamilyChoiceResponseDto>> choiceFamily(
            HttpServletRequest httpServletRequest,
            @RequestParam(name = "familyId") long familyId){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyChoiceResponseDto familyChoiceResponse = familyService.choiceFamily(findMember, familyId);
        return new ResponseEntity<>(
                ResponseTemplate.<FamilyChoiceResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_CHOICE_SUCCESS.getMessage())
                        .data(familyChoiceResponse)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "가족 정보 수정", description = "가족의 정보 수정하는 API")
    @PostMapping("/modify")
    public ResponseEntity<ResponseTemplate<FamilyModifyResponseDto>> modifyFamily(
        HttpServletRequest httpServletRequest,
        @RequestPart(name = "familyModifyRequest") String jsonString,
        @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        FamilyModifyReqeustDto familyRegisterRequest = mapper.readValue(jsonString, FamilyModifyReqeustDto.class);

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyModifyResponseDto familyModifyResponse = familyService.modifyFamily(findMember, familyRegisterRequest, file);

        return new ResponseEntity<>(
            ResponseTemplate.<FamilyModifyResponseDto>builder()
                .msg(FamilyResponseMessage.FAMILY_MODIFY_SUCCESS.getMessage())
                .data(familyModifyResponse)
                .result(true)
                .build(),
            HttpStatus.OK);
    }


    @ExceptionHandler(MemberAlreadyRegisteredInFamilyException.class)
    public ResponseEntity<ResponseTemplate<String>> handleMemberAlreadyRegisteredInFamily(
            MemberAlreadyRegisteredInFamilyException ex) {
        return new ResponseEntity<>(
                ResponseTemplate.<String>builder()
                        .msg(ex.getMessage())
                        .result(false)
                        .build(),
                HttpStatus.BAD_REQUEST);
    }


    @Operation(summary = "가족 멤버 리스트 조회", description = "가족 멤버 리스트 조회 API")
    @GetMapping("/member")
    public ResponseEntity<ResponseTemplate<FamilyMemberResponseDto>> getFamilyMember(HttpServletRequest httpServletRequest,
                                                                                     @RequestParam(name = "familyId") long familyId){
        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyMemberResponseDto responseDto = familyService.getFamilyMember(findMember, familyId);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyMemberResponseDto> builder()
                        .msg(FamilyResponseMessage.FAMILY_MEMBER_SECCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @PostMapping("/check")
    public ResponseEntity<ResponseTemplate<FamilyCheckCodeResponseDto>> checkFamilyCode(HttpServletRequest httpServletRequest,
                                                                                        @RequestBody FamilyCheckCodeRequestDto familyCheckCodeRequestDto){
        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);
        FamilyCheckCodeResponseDto responseDto = familyService.checkFamilyCode(findMember, familyCheckCodeRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyCheckCodeResponseDto> builder()
                        .msg(FamilyResponseMessage.FAMILY_CHECK_SUCCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }

    @Operation(summary = "가족 초대 메시지 전송", description = "가족 초대 메시지 전송 API")
    @PostMapping("/message")
    public ResponseEntity<ResponseTemplate<FamilyInviteResponseDto>> getFamilyCode(HttpServletRequest httpServletRequest,
                                                                                   @RequestBody FamilyInviteRequestDto familyInviteRequestDto){
        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyInviteResponseDto responseDto = familyService.inviteFamily(findMember, familyInviteRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyInviteResponseDto> builder()
                        .msg(FamilyResponseMessage.FAMILY_INVITE_SUCCESS.getMessage())
                        .data(responseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }
}
