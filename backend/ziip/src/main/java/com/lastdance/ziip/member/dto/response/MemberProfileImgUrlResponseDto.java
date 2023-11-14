package com.lastdance.ziip.member.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Builder
public class MemberProfileImgUrlResponseDto {
	private Long id;
	private String profileImgUrl;

	public MemberProfileImgUrlResponseDto(Long id, String profileImgUrl) {
		this.id = id;
		this.profileImgUrl = profileImgUrl;
	}
}
