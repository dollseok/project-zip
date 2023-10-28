package com.lastdance.ziip.schedule.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleListResponseDto {

    private List<ScheduleListDetailResponseDto> scheduleListDetailResponseList;
}
