package com.lastdance.ziip.member.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class FcmTokenResponseDto {
	private List<String> fcmToken;
	private String googleAccessToken;
}
