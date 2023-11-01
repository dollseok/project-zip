package com.lastdance.ziip.diary.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryCommentDeleteRequestDto {

    private Long commentId;
    private Long memberId;
}
