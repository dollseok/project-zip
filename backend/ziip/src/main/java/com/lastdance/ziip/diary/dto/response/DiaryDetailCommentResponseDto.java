package com.lastdance.ziip.diary.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryDetailCommentResponseDto {

    private Long commentId;
    private String name;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
