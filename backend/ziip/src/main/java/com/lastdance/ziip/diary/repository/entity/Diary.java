package com.lastdance.ziip.diary.repository.entity;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.entity.BaseEntity;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.lastdance.ziip.member.repository.entity.Member;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class Diary extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
     
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
     
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emotion_id")
    private Emotion emotion;

    private String title;

    private String content;

    @OneToMany(mappedBy = "diary", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<DiaryPhoto> diaryPhotos;

    @OneToMany(mappedBy = "diary", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<DiaryComment> diaryComments;

    @OneToMany(mappedBy = "diary", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<DiaryAlert> diaryAlerts;
}
