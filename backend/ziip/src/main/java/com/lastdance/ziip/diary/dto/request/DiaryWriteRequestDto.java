package com.lastdance.ziip.diary.dto.request;

import com.lastdance.ziip.diary.dto.response.DiaryWriteResponseDto;
import com.lastdance.ziip.diary.repository.entity.Emotion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryWriteRequestDto {

    private Long familyId;
    private String title;
    private String content;
    private Long emotionId;
}
