package com.lastdance.ziip.family.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FamilyRegisterRequestDto {

    String name;
    String content;
    String nickname;
}
