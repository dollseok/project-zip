package com.lastdance.ziip.diary.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryListResponseDto {

    private List<DiaryListDetailResponseDto> diaryListDetailResponseList;
}
