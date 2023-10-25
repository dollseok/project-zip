package com.lastdance.ziip.diary.repository.entity;

import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.repository.entity.Member;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

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
public class DiaryComment extends BaseEntity {

    @Id @GeneratedValue
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @Column(nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    @Column(nullable = false)
    private Diary diary;

    @Column(nullable = false)
    private String content;

}

