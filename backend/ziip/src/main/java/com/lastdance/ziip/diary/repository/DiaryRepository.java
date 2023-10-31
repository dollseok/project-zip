package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.dto.response.DiaryListDetailResponseDto;
import com.lastdance.ziip.diary.repository.entity.Diary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findAllByFamilyId(Long FamilyId);
}
