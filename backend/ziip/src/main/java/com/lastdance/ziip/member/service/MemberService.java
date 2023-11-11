package com.lastdance.ziip.member.service;

import com.lastdance.ziip.family.dto.response.FamilyMemberDetailResponseDto;
import com.lastdance.ziip.member.dto.LoginDto;
import com.lastdance.ziip.member.dto.TokenDto;
import com.lastdance.ziip.member.dto.request.MemberInfoUpdateRequestDto;
import com.lastdance.ziip.member.dto.response.BaseResponseDto;
import com.lastdance.ziip.member.dto.response.FcmTokenResponseDto;
import com.lastdance.ziip.member.dto.response.MemberAllInfoResponse;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MemberService {

    LoginDto findKakaoMemberByAuthorizedCode(String code, String kakaoRedirectUrl, String fcmToken);

    LoginDto findNaverMemberByAuthorizedCode(String code, String naverState);
    TokenDto reissue(String refreshToken);

    Member findMemberByJwtToken(String token);

    BaseResponseDto updateMemberInfo(Long memberId, MemberInfoUpdateRequestDto memberInfoUpdateRequestDto, Member findMember, MultipartFile file) throws IOException;

    BaseResponseDto updateNickname(String nickname, Member findMember);
    BaseResponseDto updateMemberProfileImage(Member findMember, MultipartFile file) throws IOException;

    BaseResponseDto validNickname(String nickname, Member findMember);
//
//    BaseResponseDto deleteMember(Member findMember);
//
//    MemberInfoResponseDto getMemberInfo(Member findMember);

    MemberAllInfoResponse getALlMemberInfo(Member findMember);
    FcmTokenResponseDto findFcmTokensByFamilyIdAndExcludeMemberId(Member findMember, Long familyId);
}
