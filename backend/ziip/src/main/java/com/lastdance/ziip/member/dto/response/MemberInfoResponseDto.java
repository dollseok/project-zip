package com.lastdance.ziip.member.dto.response;

import com.lastdance.ziip.member.enums.Gender;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberInfoResponseDto {

    private Long id;
    private String email;
    private String name;
    private Gender gender;
    private String profileImgUrl;

    @Builder
    public MemberInfoResponseDto(Member member) {
        this.id = member.getId();
        this.email = member.getEmail();
        this.name = member.getName();
        this.gender = member.getGender();
        this.profileImgUrl = member.getProfileImgUrl();
    }
}