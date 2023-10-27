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

    Long id;
    String name;
    String profileImgUrl;
}
