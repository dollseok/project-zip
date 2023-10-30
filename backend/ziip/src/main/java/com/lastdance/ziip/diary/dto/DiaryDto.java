package com.lastdance.ziip.diary.dto;

import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import com.lastdance.ziip.diary.repository.entity.DiaryPhoto;
import com.lastdance.ziip.diary.repository.entity.Emotion;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class DiaryDto {

    private Long id;

    private Long familyId;

    private Long memberId;

    private String title;

    private String content;

    private Long emotionId;
}
