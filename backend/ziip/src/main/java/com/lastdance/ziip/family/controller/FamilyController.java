package com.lastdance.ziip.family.controller;


import com.lastdance.ziip.family.dto.request.FamilyRegisterRequest;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.family.enums.FamilyResponseMessage;
import com.lastdance.ziip.family.repository.entity.Family;
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
    public ResponseEntity<ResponseTemplate<FamilyRegisterResponseDto>> registFamily(HttpServletRequest httpServletRequest,
                                                                                    @RequestPart(name = "familyRegisterRequest") FamilyRegisterRequest familyRegisterRequest,
                                                                                    @RequestParam(value = "file", required = false)MultipartFile file) throws IOException {

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) return null;

        Member findMember = memberService.findMemberByJwtToken(token);

        FamilyRegisterResponseDto familyRegisterResponseDto = familyService.registFamily(findMember, familyRegisterRequest, file);

        return new ResponseEntity<>(
                ResponseTemplate.<FamilyRegisterResponseDto>builder()
                        .msg(FamilyResponseMessage.FAMILY_REGIST_SUCCESS.getMessage())
                        .data(familyRegisterResponseDto)
                        .result(true)
                        .build(),
                HttpStatus.OK);
    }
}
