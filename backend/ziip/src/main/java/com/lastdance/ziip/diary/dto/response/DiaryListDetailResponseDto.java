package com.lastdance.ziip.diary.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiaryListDetailResponseDto {

    private Long diaryId;
    private String nickname;
    private String title;
    private LocalDateTime createdAt;
    private Long emotionId;
    private String profileImgUrl;

    public String getCreatedAt() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return createdAt.format(formatter);
    }

}
