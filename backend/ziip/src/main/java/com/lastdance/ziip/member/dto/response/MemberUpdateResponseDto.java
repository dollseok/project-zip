package com.lastdance.ziip.member.dto.response;

import com.lastdance.ziip.member.repository.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberUpdateResponseDto {

    private String name;
    private String profileImgUrl;

    @Builder
    public MemberUpdateResponseDto(Member member) {
        this.name = member.getName();
        this.profileImgUrl = member.getProfileImgUrl();
    }
}
