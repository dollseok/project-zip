package com.lastdance.ziip.plan.repository.entity;

import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Plan extends BaseEntity {

    @Id @GeneratedValue
    @Column(nullable = false)
    private Long id;

    // 일정 id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    @Column(nullable = false)
    private Schedule schedule;

    // 회원 id(담당자)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 할일 상태 코드 id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_code_id")
    @Column(nullable = false)
    private StatusCode statusCode;

    // 제목
    @Column(nullable = false)
    private String title;

    // 메모
    private String content;
}
