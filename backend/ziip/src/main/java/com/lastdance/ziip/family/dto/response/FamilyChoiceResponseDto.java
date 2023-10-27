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

    Long familyId;
    String familyName;
    String familyContent;
    String familyProfileImgUrl;
    String memberProfileImgUrl;

}
