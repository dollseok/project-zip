package com.lastdance.ziip.plan.repository.entity;

import com.lastdance.ziip.global.util.CodeConverter;
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

    @Convert(converter = CodeConverter.class)
    private Code code;
}
