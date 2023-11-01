package com.lastdance.ziip.diary.service;

import com.lastdance.ziip.diary.dto.request.DiaryCommentDeleteRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryCommentModifyRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryCommentWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.DiaryCommentDeleteResponseDto;
import com.lastdance.ziip.diary.dto.response.DiaryCommentModifyResponseDto;
import com.lastdance.ziip.diary.dto.response.DiaryCommentWriteResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;

public interface DiaryCommentService {

    DiaryCommentWriteResponseDto writeDiaryComment(Member findMember, DiaryCommentWriteRequestDto diaryCommentWriteRequestDto);


    DiaryCommentModifyResponseDto modifyDiaryComment(Member findMember, DiaryCommentModifyRequestDto diaryCommentModifyRequestDto);

    DiaryCommentDeleteResponseDto deleteDiaryComment(Member findMember, DiaryCommentDeleteRequestDto diaryCommentDeleteRequestDto);
}
