package com.lastdance.ziip.member.dto.request;

import lombok.Data;

@Data
public class LoginRequestDto {

    private String code;
    private String fcmToken;
}
