package com.lastdance.ziip.diary.service;

import com.lastdance.ziip.diary.dto.request.DiaryCommentWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.DiaryCommentWriteResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;

public interface DiaryCommentService {

    DiaryCommentWriteResponseDto writeDiaryComment(Member findMember, DiaryCommentWriteRequestDto diaryCommentWriteRequestDto);

}
