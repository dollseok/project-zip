package com.lastdance.ziip.family.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyListDetailResponseDto {

    private Long id;
    private String name;
    private String profileImgUrl;
}
