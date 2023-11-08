package com.lastdance.ziip.schedule.repository.entity;

import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.global.entity.BaseEntity;
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

    private String imgUrl;

    private String imgName;

}
