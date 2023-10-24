package com.lastdance.ziip.family.repository.entity;

import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.question.repository.entity.Question;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
public class Family extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    private String name;
    private String code;
    private String profileImgUrl;
    private String profileImgName;

    @OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
    private List<Diary> diaries;

    @OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
    private List<FamilyMember> familyMembers;

    @OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
    private List<Question> questions;
}
