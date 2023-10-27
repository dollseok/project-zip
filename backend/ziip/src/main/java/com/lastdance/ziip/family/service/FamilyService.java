package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.FamilyNickNameRequest;
import com.lastdance.ziip.family.dto.request.FamilyRegisterAcceptRequestDto;
import com.lastdance.ziip.family.dto.request.FamilyRegisterRequestDto;
import com.lastdance.ziip.family.dto.response.FamilyListResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyNickNameResponse;
import com.lastdance.ziip.family.dto.response.FamilyRegisterAcceptResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FamilyService {

    FamilyRegisterResponseDto registFamily(Member findMember, FamilyRegisterRequestDto familyRegisterRequest, MultipartFile file) throws IOException;

    FamilyRegisterAcceptResponseDto acceptFamily(Member findMember, FamilyRegisterAcceptRequestDto familyRegisterAcceptRequest);

    FamilyListResponseDto listFamily(Member findMember);

    FamilyNickNameResponse modifyNickname(Member findMember, FamilyNickNameRequest familyNickNameRequest);
}
