package com.lastdance.ziip.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class LoginResponseDto {

    private Long id;
    private String message;
    private String name;
    private Boolean firstLogin;
    private String googleAccessToken;
}
