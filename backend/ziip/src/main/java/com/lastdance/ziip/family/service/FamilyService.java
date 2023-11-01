package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.FamilyModifyReqeustDto;
import com.lastdance.ziip.family.dto.request.FamilyNickNameRequestDto;
import com.lastdance.ziip.family.dto.request.FamilyRegisterAcceptRequestDto;
import com.lastdance.ziip.family.dto.request.FamilyRegisterRequestDto;
import com.lastdance.ziip.family.dto.response.FamilyChoiceResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyListResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyModifyResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyNickNameResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyRegisterAcceptResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FamilyService {

    FamilyRegisterResponseDto registFamily(Member findMember, FamilyRegisterRequestDto familyRegisterRequest, MultipartFile file) throws IOException;

    FamilyRegisterAcceptResponseDto acceptFamily(Member findMember, FamilyRegisterAcceptRequestDto familyRegisterAcceptRequest);

    FamilyListResponseDto listFamily(Member findMember);

    FamilyNickNameResponseDto modifyNickname(Member findMember, FamilyNickNameRequestDto familyNickNameRequest);

    FamilyChoiceResponseDto choiceFamily(Member findMember, long familyId);
    FamilyModifyResponseDto modifyFamily(Member findMember, FamilyModifyReqeustDto familyModifyReqeustDto, MultipartFile file) throws IOException;
}
