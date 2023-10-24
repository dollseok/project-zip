package com.lastdance.ziip.diary.repository.entity;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.entity.BaseEntity;
import java.util.List;
import javax.persistence.*;

import com.lastdance.ziip.member.repository.entity.Member;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Diary extends BaseEntity {

    @Id @GeneratedValue
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emotion_id")
    private Emotion emotion;

    private String title;
    private String content;

    @OneToMany(mappedBy = "diary", fetch = FetchType.LAZY)
    private List<DiaryPhoto> diaryPhotos;

    @OneToMany(mappedBy = "diary", fetch = FetchType.LAZY)
    private List<DiaryComment> diaryComments;
}
