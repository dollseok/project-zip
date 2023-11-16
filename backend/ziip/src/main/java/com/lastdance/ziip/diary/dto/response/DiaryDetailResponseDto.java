package com.lastdance.ziip.diary.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import com.lastdance.ziip.diary.repository.entity.DiaryPhoto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryDetailResponseDto {

    private Long diaryId;

    private String name;

    private String title;

    private String content;

    private Long emotionId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;

    private List<DiaryDetailPhotoResponseDto> diaryPhotos;

    private List<DiaryDetailCommentResponseDto> diaryComments;
}
