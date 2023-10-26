package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.FamilyRegisterAcceptRequest;
import com.lastdance.ziip.family.dto.request.FamilyRegisterRequest;
import com.lastdance.ziip.family.dto.response.FamilyRegisterAcceptResponse;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FamilyService {

    FamilyRegisterResponseDto registFamily(Member findMember, FamilyRegisterRequest familyRegisterRequest, MultipartFile file) throws IOException;

    FamilyRegisterAcceptResponse acceptFamily(Member findMember, FamilyRegisterAcceptRequest familyRegisterAcceptRequest);
}
