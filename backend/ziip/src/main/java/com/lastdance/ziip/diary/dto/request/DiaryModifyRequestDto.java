package com.lastdance.ziip.diary.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryModifyRequestDto {

    private Long diaryId;
    private Long familyId;
    private String title;
    private String content;
    private Long emotionId;

}
