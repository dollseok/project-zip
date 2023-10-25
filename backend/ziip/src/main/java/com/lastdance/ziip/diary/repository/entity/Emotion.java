package com.lastdance.ziip.diary.repository.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

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

    @OneToMany(mappedBy = "emotion",fetch = FetchType.LAZY)
    private List<Diary> diaries;
}
