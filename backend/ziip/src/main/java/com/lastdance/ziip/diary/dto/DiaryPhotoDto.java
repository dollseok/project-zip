package com.lastdance.ziip.diary.dto;

import com.lastdance.ziip.diary.repository.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@AllArgsConstructor
@Builder
public class DiaryPhotoDto {

    private Long id;

    private Long diaryId;

    private String imgUrl;

    private String imgName;
}
