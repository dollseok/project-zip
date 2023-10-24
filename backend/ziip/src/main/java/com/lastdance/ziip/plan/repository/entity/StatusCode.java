package com.lastdance.ziip.plan.repository.entity;

import com.lastdance.ziip.plan.enums.Code;
import com.lastdance.ziip.plan.enums.Status;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class StatusCode {

    @Id @GeneratedValue
    @Column(nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Code code;
}
