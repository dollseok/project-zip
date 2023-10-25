package com.lastdance.ziip.diary.repository.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Emotion {

    @Id @GeneratedValue
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String emotionName;

    @Column(nullable = false)
    private String imgUrl;

    @OneToOne(mappedBy = "emotion",fetch = FetchType.LAZY)
    private Diary diary;
}
