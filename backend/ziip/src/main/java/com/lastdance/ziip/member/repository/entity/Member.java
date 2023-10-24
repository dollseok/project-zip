package com.lastdance.ziip.member.repository.entity;

import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import com.lastdance.ziip.member.enums.Gender;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.enums.Role;
import com.lastdance.ziip.member.enums.SocialType;
import com.lastdance.ziip.plan.repository.entity.Plan;

import java.util.List;
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
public class Member extends BaseEntity{

    @Id @GeneratedValue
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private String name;

    private String profileImgUrl;
    private String profileImgName;
    private String socialId;

    @Enumerated(EnumType.STRING)
    private SocialType socialType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<FamilyMember> familyMembers;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<Diary> diaries;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<DiaryComment> diaryComments;

    @OneToOne(mappedBy = "member", fetch = FetchType.LAZY)
    private Plan plan;
}
