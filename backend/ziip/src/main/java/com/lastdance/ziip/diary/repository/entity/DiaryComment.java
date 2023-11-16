package com.lastdance.ziip.diary.repository.entity;

import com.lastdance.ziip.diary.dto.request.DiaryCommentModifyRequestDto;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.repository.entity.Member;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DiaryComment extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    private String content;

    @OneToMany(mappedBy = "diaryComment", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<DiaryCommentAlert> diaryCommentAlerts;

    public void updateDiaryComment(DiaryCommentModifyRequestDto diaryCommentModifyRequestDto){
        this.content = diaryCommentModifyRequestDto.getContent();
    }
}

