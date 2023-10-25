package com.lastdance.ziip.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class NickNameResponseDto {

    private Integer memberId;
    private String name;

}
