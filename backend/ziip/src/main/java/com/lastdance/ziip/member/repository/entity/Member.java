package com.lastdance.ziip.member.repository.entity;

import com.lastdance.ziip.member.enums.Gender;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.enums.Role;
import com.lastdance.ziip.member.enums.SocialType;
import com.lastdance.ziip.schedule.repository.entity.ScheduleComment;
import com.lastdance.ziip.schedule.repository.entity.ScheduleMember;
import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.bytebuddy.agent.builder.AgentBuilder.InitializationStrategy.SelfInjection.Lazy;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Member extends BaseEntity{

    @Id @GeneratedValue
    private Integer id;

    private String email;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String name;
    private String profileImgUrl;
    private String profileImgName;
    private String socialId;

    @Enumerated(EnumType.STRING)
    private SocialType socialType;
    @Enumerated(EnumType.STRING)
    private Role role;


    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<FamilyMember> familyMembers;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ScheduleMember> scheduleMembers;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ScheduleComment> scheduleComments;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<SchedulePhoto> schedulePhotos;

}
