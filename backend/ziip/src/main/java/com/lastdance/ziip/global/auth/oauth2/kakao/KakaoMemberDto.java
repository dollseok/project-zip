package com.lastdance.ziip.global.auth.oauth2.kakao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class KakaoMemberDto {
    private String socialId;
    private String email;

}
