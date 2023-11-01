package com.lastdance.ziip.diary.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryCommentDeleteResponseDto {

    private Long commentId;
}
