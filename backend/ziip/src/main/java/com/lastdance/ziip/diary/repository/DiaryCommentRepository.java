package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Long> {
    List<DiaryComment> findAllByDiary(Diary diary);

}
