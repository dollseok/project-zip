package com.lastdance.ziip.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class RefreshTokenResponseDto {
    private Long id;
    private String message;

    @Builder
    public RefreshTokenResponseDto(Long id, String message) {
        this.id = id;
        this.message = message;
    }
}
