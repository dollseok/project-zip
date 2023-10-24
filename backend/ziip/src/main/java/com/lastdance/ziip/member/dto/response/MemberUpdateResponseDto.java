package com.lastdance.ziip.member.dto.response;

import com.lastdance.ziip.member.repository.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberUpdateResponseDto {

    private String nickname;
    private String profileImgPath;

    @Builder
    public MemberUpdateResponseDto(Member member) {
        this.nickname = member.getNickname();
        this.profileImgPath = member.getProfileImgPath();
    }
}
