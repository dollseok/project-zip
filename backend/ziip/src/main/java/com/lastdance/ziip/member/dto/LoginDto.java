package com.lastdance.ziip.member.dto;

import com.lastdance.ziip.member.enums.SocialType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class LoginDto {

    private Long id;
    private String socialId;
    private SocialType socialType;
    private String name;
    private String fcmToken;
    private boolean firstLogin;
}