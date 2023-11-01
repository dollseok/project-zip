package com.lastdance.ziip.diary.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryCommentModifyRequestDto {

    private Long commentId;
    private Long memberId;
    private Long scheduleId;
    private String content;

}
