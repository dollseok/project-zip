package com.lastdance.ziip.diary.service;

import com.lastdance.ziip.diary.dto.request.DiaryCommentWriteRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryDeleteRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryModifyRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.*;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DiaryService {

    DiaryWriteResponseDto writeDiary(Member findMember, DiaryWriteRequestDto diaryWriteRequestDto, List<MultipartFile> files);

    DiaryListResponseDto listDiary(Member findMember, long familyId);

    DiaryDetailResponseDto getDiaryDetail(Member findMember, Long diaryId);

    DiaryDeleteResponseDto deleteDiary(Member findMember, Long diaryId);

    DiaryModifyResponseDto modifyDiary(Member findMember, DiaryModifyRequestDto diaryModifyRequestDto, MultipartFile file);
}
