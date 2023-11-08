package com.lastdance.ziip.schedule.repository.entity;

import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SchedulePhoto extends BaseEntity {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String imgUrl;

    private String imgName;

}
