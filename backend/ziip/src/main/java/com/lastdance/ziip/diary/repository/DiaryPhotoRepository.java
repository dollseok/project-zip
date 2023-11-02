package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.dto.response.DiaryDetailPhotoResponseDto;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiaryPhotoRepository extends JpaRepository<DiaryPhoto, Long> {
    List<DiaryPhoto> findAllByDiary(Diary diary);
}
