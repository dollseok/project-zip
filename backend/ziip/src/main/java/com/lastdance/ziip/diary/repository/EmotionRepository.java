package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.repository.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionRepository extends JpaRepository<Emotion, Long> {

}
