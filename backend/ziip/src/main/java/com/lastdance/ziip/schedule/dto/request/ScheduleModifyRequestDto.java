package com.lastdance.ziip.schedule.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleModifyRequestDto {

    private Long scheduleId;
    private Long familyId;
    private String scheduleTitle;
    private String startDate;
    private String endDate;
}
