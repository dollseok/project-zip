package com.lastdance.ziip.schedule.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleDeleteRequestDto {

    private Long scheduleId;
    private Long familyId;
}
