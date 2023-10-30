package com.lastdance.ziip.diary.service;

import com.lastdance.ziip.diary.dto.request.DiaryWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.DiaryWriteResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DiaryService {

    DiaryWriteResponseDto writeDiary(Member findMember, DiaryWriteRequestDto diaryWriteRequestDto, List<MultipartFile> files);

}
