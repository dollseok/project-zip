package com.lastdance.ziip.family.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FamilyChoiceResponseDto {

    private Long familyId;
    private String familyName;
    private String familyContent;
    private String familyProfileImgUrl;
    private String memberProfileImgUrl;

}
