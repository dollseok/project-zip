package com.lastdance.ziip.diary.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryCommentWriteRequestDto {

    private Long diaryId;
    private String content;

}
