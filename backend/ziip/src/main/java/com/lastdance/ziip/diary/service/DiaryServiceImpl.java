package com.lastdance.ziip.diary.service;

import com.lastdance.ziip.diary.dto.request.DiaryWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.DiaryListDetailResponseDto;
import com.lastdance.ziip.diary.dto.response.DiaryListResponseDto;
import com.lastdance.ziip.diary.dto.response.DiaryWriteResponseDto;
import com.lastdance.ziip.diary.repository.DiaryPhotoRepository;
import com.lastdance.ziip.diary.repository.DiaryRepository;
import com.lastdance.ziip.diary.repository.EmotionRepository;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryPhoto;
import com.lastdance.ziip.diary.repository.entity.Emotion;
import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.awsS3.S3Uploader;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DiaryServiceImpl implements DiaryService{

    private final FamilyRepository familyRepository;
    private final EmotionRepository emotionRepository;
    private final DiaryRepository diaryRepository;
    private final DiaryPhotoRepository diaryPhotoRepository;
    private final S3Uploader s3Uploader;

    @Override
    public DiaryWriteResponseDto writeDiary(Member findMember,
                                            DiaryWriteRequestDto diaryWriteRequestDto,
                                            List<MultipartFile> files) {

        // 엔티티 조회
        Optional<Family> family = familyRepository.findById(diaryWriteRequestDto.getFamilyId());

        Optional<Emotion> emotion = emotionRepository.findById(diaryWriteRequestDto.getEmotionId());

        // 일기 빌드 // DTO로 받아와서 처리
        Diary diary = Diary.builder()
                .family(family.get())
                .member(findMember)
                .title(diaryWriteRequestDto.getTitle())
                .content(diaryWriteRequestDto.getContent())
                .emotion(emotion.get())
                .build();

        // 이미지 정보 가져오기
        if (!files.isEmpty()) {

            files.stream().forEach(
                file -> {
                    String fileUrl = null;
                    try {
                        fileUrl = s3Uploader.upload(file, "diary");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    String OriginalName = file.getOriginalFilename();

                    // 일기 사진 빌드
                    DiaryPhoto diaryPhoto = DiaryPhoto.builder()
                            .diary(diary)
                            .imgUrl(fileUrl)
                            .imgName(OriginalName)
                            .build();

                    DiaryPhoto saveDiaryPhoto = diaryPhotoRepository.save(diaryPhoto);
                }
            );

        }

        Diary saveDiary = diaryRepository.save(diary);

        DiaryWriteResponseDto diaryWriteResponseDto = DiaryWriteResponseDto.builder()
                .diaryId(saveDiary.getId())
                .build();

        return diaryWriteResponseDto;
    };

    @Override
    public DiaryListResponseDto listDiary(Member findMember, long familyId) {

        List<Diary> diaries = diaryRepository.findAllByFamilyId(familyId);

        List<DiaryListDetailResponseDto> diaryListDetailResponseDtos= diaries.stream()
                .map(d -> DiaryListDetailResponseDto.builder()
                    .diaryId(d.getId())
                    .nickname(findMember.getName())
                    .title(d.getTitle())
                    .createdAt(d.getCreatedAt())
                    .emotionId(d.getEmotion().getId())
                    .build())
                .collect(Collectors.toList());

        return DiaryListResponseDto.builder()
                .diaryListDetailResponseList(diaryListDetailResponseDtos)
                .build();
    };

}
