package com.lastdance.ziip.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class NickNameResponseDto {

    private Long memberId;
    private String name;

}
