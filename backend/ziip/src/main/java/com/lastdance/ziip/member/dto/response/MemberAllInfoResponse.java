package com.lastdance.ziip.member.dto.response;

import com.lastdance.ziip.member.enums.SocialType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberAllInfoResponse {

    private Long id;
    private String email;
    private String name;
    private String gender;
    private String profileImgName;
    private String profileImgUrl;
    private String SocialId;
    private SocialType socialType;
    private String role;

    @Builder
    public MemberAllInfoResponse(Long id, String email, String name, String gender, String profileImgName, String profileImgUrl, String socialId, SocialType socialType, String role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.gender = gender;
        this.profileImgName = profileImgName;
        this.profileImgUrl = profileImgUrl;
        this.SocialId = socialId;
        this.socialType = socialType;
        this.role = role;
    }
}
