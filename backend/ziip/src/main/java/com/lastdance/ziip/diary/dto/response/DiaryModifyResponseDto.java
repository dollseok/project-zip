package com.lastdance.ziip.diary.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class DiaryModifyResponseDto {

    Long diaryId;

    @Builder
    public DiaryModifyResponseDto(Long diaryId) {
        this.diaryId = diaryId;
    }
}
