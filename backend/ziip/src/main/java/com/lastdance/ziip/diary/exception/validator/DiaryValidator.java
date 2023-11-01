package com.lastdance.ziip.diary.exception.validator;

import com.lastdance.ziip.diary.exception.NoExistDiary;
import com.lastdance.ziip.diary.exception.NoMatchingManager;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Component
public class DiaryValidator {

    public void checkDiaryExist(Optional<Diary> diary){
        if (diary.isEmpty()){
            throw new NoExistDiary("해당 일기가 존재하지 않습니다.");
        }
    }

    public void checkDiaryCommentExist(Optional<DiaryComment> diaryComment){
        if (diaryComment.isEmpty()){
            throw new NoExistDiary("해당 댓글이 존재하지 않습니다.");
        }
    }

    public void checkDiaryCommentManager(DiaryComment diaryComment, Long memberId) {
        if (diaryComment.getMember().getId() != memberId) {
            throw new NoMatchingManager("해당 일기의 작성자가 아닙니다.");
        }
    }
}
