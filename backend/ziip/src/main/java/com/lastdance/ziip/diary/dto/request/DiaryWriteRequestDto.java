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

    /**
     *  "memberId (long)": 일기 작성자 Id,
     * 	"familyId (long)": 일기가 작성되는 가족 Id,
     * 	"title (varchar)": "일기 제목",
     * 	"content (text)": "일기 내용",
     * 	"imgUrl (list)": [
     * 				"이미지 URL", "이미지 URL", ...
     * 	]
     */

    private Long memberId;
    private Long familyId;
    private String title;
    private String content;
    private Long emotionId;
}
