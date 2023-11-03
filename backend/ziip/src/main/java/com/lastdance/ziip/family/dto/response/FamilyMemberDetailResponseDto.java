package com.lastdance.ziip.family.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FamilyMemberDetailResponseDto {
    Long memberId;
    String nickname;
}
