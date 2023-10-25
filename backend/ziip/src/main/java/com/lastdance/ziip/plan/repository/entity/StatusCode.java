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
     
    private Long id;

    @Enumerated(EnumType.STRING)
     
    private Status status;

    @Enumerated(EnumType.STRING)
     
    private Code code;
}
