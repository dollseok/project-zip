package com.lastdance.ziip.schedule.repository.entity;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.entity.BaseEntity;
import java.time.LocalDate;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    private String name;
    private String imgUrl;
    private String imgName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String content;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<ScheduleMember> scheduleMembers;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<SchedulePhoto> schedulePhotos;
}
