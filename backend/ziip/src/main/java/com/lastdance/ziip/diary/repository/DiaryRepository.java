package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.dto.response.DiaryListDetailResponseDto;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long>, QuerydslPredicateExecutor<Diary> {

    List<Diary> findAllByCreatedAtBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Diary> findAllByFamilyId(Long FamilyId);
}
