package com.lastdance.ziip.family.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FamilyRegisterRequestDto {

    private String name;
    private String content;
    private String nickname;
}
