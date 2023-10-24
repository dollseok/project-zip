package com.lastdance.ziip.diary.repository.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Emotion {

    @Id @GeneratedValue
    private Long id;

    private String emotionName;
    private String imgUrl;

    @OneToOne(mappedBy = "emotion",fetch = FetchType.LAZY)
    private Emotion emotion;
}
