package com.lastdance.ziip.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleListDetailResponseDto {

    private Long scheduleId;
    private Long memberId;
    private String name;
    private String startDate;
    private String endDate;
    private String nickname;
    private String profileImgUrl;
}
