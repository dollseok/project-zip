package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.*;
import com.lastdance.ziip.family.dto.response.*;
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
    FamilyMemberResponseDto getFamilyMember(Member findMember, long familyId);
    FamilyCheckCodeResponseDto checkFamilyCode(Member findMember, FamilyCheckCodeRequestDto familyCheckCodeRequestDto);
    FamilyInviteResponseDto inviteFamily(Member findMember, FamilyInviteRequestDto familyInviteRequestDto);
    FamilyMemberDetailResponseDto getMemberNickname(Member findMember, Long familyId);

}
