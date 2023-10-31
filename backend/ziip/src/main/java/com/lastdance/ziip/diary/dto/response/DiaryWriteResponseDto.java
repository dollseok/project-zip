package com.lastdance.ziip.diary.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class DiaryWriteResponseDto {

    Long diaryId;

    @Builder
    public DiaryWriteResponseDto(Long diaryId) {
        this.diaryId = diaryId;
    }
}
