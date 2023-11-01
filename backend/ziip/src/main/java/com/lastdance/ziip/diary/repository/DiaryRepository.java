package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.repository.entity.Diary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findAllByCreatedAtBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}
