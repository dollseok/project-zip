package com.lastdance.ziip.family.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyInviteRequestDto {
    private long familyId;
    private List<String> phoneNumber;
}
