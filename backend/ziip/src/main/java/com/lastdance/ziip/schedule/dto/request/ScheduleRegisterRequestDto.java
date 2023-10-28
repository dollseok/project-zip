package com.lastdance.ziip.schedule.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleRegisterRequestDto {

    private Long familyId;
    private String title;
    private String startDate;
    private String endDate;
}
