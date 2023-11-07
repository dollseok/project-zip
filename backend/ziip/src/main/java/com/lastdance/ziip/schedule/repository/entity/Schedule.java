package com.lastdance.ziip.schedule.repository.entity;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.repository.entity.Member;
import java.time.LocalDate;
import java.util.List;
import javax.persistence.*;

import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.ScheduleModifyRequestDto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Schedule extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String title;
    private LocalDate startDate;
    private LocalDate endDate;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<Plan> plans;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<SchedulePhoto> schedulePhotos;

    public void update(ScheduleModifyRequestDto scheduleModifyRequestDto){
        this.title = scheduleModifyRequestDto.getScheduleTitle();
        this.startDate = LocalDate.parse(scheduleModifyRequestDto.getStartDate());
        this.endDate = LocalDate.parse(scheduleModifyRequestDto.getEndDate());
    }

}
