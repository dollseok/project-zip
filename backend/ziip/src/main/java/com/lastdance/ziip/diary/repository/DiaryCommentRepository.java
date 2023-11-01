package com.lastdance.ziip.diary.repository;

import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Long> {
}
