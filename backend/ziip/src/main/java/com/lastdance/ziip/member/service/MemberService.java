package com.lastdance.ziip.member.service;

import com.lastdance.ziip.member.dto.LoginDto;
import com.lastdance.ziip.member.dto.TokenDto;
import com.lastdance.ziip.member.dto.request.MemberInfoUpdateRequestDto;
import com.lastdance.ziip.member.dto.response.BaseResponseDto;
import com.lastdance.ziip.member.dto.response.MemberInfoResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;

public interface MemberService {

    LoginDto findKakaoMemberByAuthorizedCode(String code, String kakaoRedirectUrl);

    LoginDto findNaverMemberByAuthorizedCode(String code, String naverState);
    TokenDto reissue(String refreshToken);

    Member findMemberByJwtToken(String token);

//    BaseResponseDto updateMemberInfo(Integer memberId, MemberInfoUpdateRequestDto memberInfoUpdateRequestDto, Member findMember, MultipartFile file);
//
    BaseResponseDto updateNickname(String nickname, Member findMember);

    BaseResponseDto validNickname(String nickname, Member findMember);
//
//    BaseResponseDto deleteMember(Member findMember);
//
//    MemberInfoResponseDto getMemberInfo(Member findMember);
}
