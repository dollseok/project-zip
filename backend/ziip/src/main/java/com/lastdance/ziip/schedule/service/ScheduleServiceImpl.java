package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.family.repository.FamilyMemberRepository;
import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.awsS3.S3Uploader;
import com.lastdance.ziip.member.dto.response.MemberInfoResponseDto;
import com.lastdance.ziip.member.dto.response.MemberProfileImgUrlResponseDto;
import com.lastdance.ziip.member.repository.MemberRepository;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.ScheduleDeleteRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleModifyRequestDto;
import com.lastdance.ziip.schedule.dto.request.SchedulePhotoRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.exception.validator.ScheduleValidator;
import com.lastdance.ziip.schedule.repository.SchedulePhotoRepository;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.Schedule;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final FamilyRepository familyRepository;
    private final ScheduleRepository scheduleRepository;
    private final SchedulePhotoRepository schedulePhotoRepository;
    private final PlanRepository planRepository;
    private final S3Uploader s3Uploader;
    private final ScheduleValidator scheduleValidator;
    private final FamilyMemberRepository familyMemberRepository;
    private final MemberRepository memberRepository;

    @Override
    public ScheduleRegisterResponseDto registerSchedule(Member findMember,
                                                        ScheduleRegisterRequestDto scheduleRegisterRequestDto) {

        System.out.println(scheduleRegisterRequestDto.getFamilyId());
        Optional<Family> family = familyRepository.findById(scheduleRegisterRequestDto.getFamilyId());

        Schedule schedule = Schedule.builder()
                .family(family.get())
                .member(findMember)
                .title(scheduleRegisterRequestDto.getTitle())
                .startDate(LocalDate.parse(scheduleRegisterRequestDto.getStartDate()))
                .endDate(LocalDate.parse(scheduleRegisterRequestDto.getEndDate()))
                .build();

        Schedule saveSchedule = scheduleRepository.save(schedule);

        ScheduleRegisterResponseDto scheduleRegisterResponseDto = ScheduleRegisterResponseDto.builder()
                .scheduleId(saveSchedule.getId())
                .build();

        return scheduleRegisterResponseDto;
    }

    @Override
    public ScheduleListResponseDto listSchedule(Member findMember, long familyId) {
        Optional<Family> family = familyRepository.findById(familyId);

        List<Schedule> schedules = scheduleRepository.findAllByFamily(
                Optional.ofNullable(family.orElse(null)));

        List<FamilyMember> familyMember = familyMemberRepository.findByFamily(family.get());

        List<MemberProfileImgUrlResponseDto> memberList = memberRepository.findIdAndProfileImgUrlById(familyId);

        List<ScheduleListDetailResponseDto> scheduleListDetailResponseDtos = schedules.stream()
            .map(schedule -> {
                // findMember의 ID와 일치하는 FamilyMember 찾기
                String memberNickname = familyMember.stream()
                    .filter(fm -> fm.getMember().getId().equals(findMember.getId()))
                    .map(FamilyMember::getNickname)
                    .findFirst()
                    .orElse("Unknown"); // 닉네임이 없으면 기본값 설정
                
                String profileImgUrl = memberList.stream()
                    .filter(dto -> dto.getId().equals(schedule.getMember().getId()))
                    .map(MemberProfileImgUrlResponseDto::getProfileImgUrl)
                    .findFirst()
                    .orElse(null); // 일치하는 프로필 이미지 URL이 없으면 null 설정

                return ScheduleListDetailResponseDto.builder()
                    .scheduleId(schedule.getId())
                    .memberId(schedule.getMember().getId())
                    .name(schedule.getTitle())
                    .startDate(String.valueOf(schedule.getStartDate()))
                    .endDate(String.valueOf(schedule.getEndDate()))
                    .nickname(memberNickname) // 닉네임 설정
                    .profileImgUrl(profileImgUrl)
                    .build();
            })
            .collect(Collectors.toList());

        return ScheduleListResponseDto.builder()
                .scheduleListDetailResponseList(scheduleListDetailResponseDtos)
                .build();
    }

    @Override
    public ScheduleDetailResponseDto detailSchedule(Member findMember, long scheduleId) {

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 스케줄을 찾을 수 없습니다. id번호 : " + scheduleId));

        List<ScheduleDetailPlanResponseDto> scheduleDetailPlanResponseDtos =
                planRepository.findAllBySchedule(Optional.of(schedule)).stream()
                        .map(plan -> ScheduleDetailPlanResponseDto.builder()
                                .planId(plan.getId())
                                .memberId(plan.getMember().getId())
                                .statusCode(Long.valueOf(plan.getStatusCode().getCode().getValue()))
                                .title(plan.getTitle())
                                .build())
                        .collect(Collectors.toList());

        List<ScheduleDetailPhotoResponseDto> scheduleDetailPhotoResponseDtos =
                schedulePhotoRepository.findAllBySchedule(Optional.of(schedule)).stream()
                        .map(schedulePhoto -> ScheduleDetailPhotoResponseDto.builder()
                                .schedulePhotoId(schedulePhoto.getId())
                                .imgUrl(schedulePhoto.getImgUrl())
                                .createdAt(schedulePhoto.getCreatedAt())
                                .build())
                        .collect(Collectors.toList());

        ScheduleDetailResponseDto scheduleDetailResponseDto = ScheduleDetailResponseDto.builder()
                .title(schedule.getTitle())
                .startDate(String.valueOf(schedule.getStartDate()))
                .endDate(String.valueOf(schedule.getEndDate()))
                .plans(scheduleDetailPlanResponseDtos)
                .photos(scheduleDetailPhotoResponseDtos)
                .build();

        return scheduleDetailResponseDto;
    }

    @Override
    public ScheduleModifyResponseDto modifySchedule(Member findMember, ScheduleModifyRequestDto scheduleModifyRequestDto) {

        Optional<Schedule> schedule = scheduleRepository.findById(scheduleModifyRequestDto.getScheduleId());

        schedule.get().update(scheduleModifyRequestDto);

        scheduleRepository.save(schedule.get());

        ScheduleModifyResponseDto scheduleModifyResponseDto = ScheduleModifyResponseDto.builder()
                .scheduleId(scheduleModifyRequestDto.getScheduleId())
                .build();

        return scheduleModifyResponseDto;
    }

    @Override
    public ScheduleDeleteResponseDto deleteService(Member findMember, ScheduleDeleteRequestDto scheduleDeleteRequestDto) {

        Schedule schedule = scheduleRepository.findById(scheduleDeleteRequestDto.getScheduleId())
                .orElseThrow(() -> new IllegalArgumentException("해당하는 스케줄을 찾을 수 없습니다. id번호 : " + scheduleDeleteRequestDto.getScheduleId()));


        planRepository.findAllBySchedule(Optional.of(schedule)).stream()
                .forEach(planRepository::delete);

        scheduleRepository.delete(schedule);

        ScheduleDeleteResponseDto scheduleDeleteResponseDto = ScheduleDeleteResponseDto.builder()
                .memberId(findMember.getId())
                .build();

        return scheduleDeleteResponseDto;
    }

    @Override
    public SchedulePhotoRegisterResponseDto registSchedulePhoto(Member findMember, List<MultipartFile> files , SchedulePhotoRegisterRequestDto requestDto) {

        Optional<Schedule> schedule = scheduleRepository.findById(requestDto.getScheduleId());

        if (!files.isEmpty()){
            files.stream().forEach(
                    file -> {
                        String fileUrl = null;
                        try {
                            fileUrl = s3Uploader.upload(file, "schedulePhoto");
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                        String OriginalName = file.getOriginalFilename();

                        SchedulePhoto schedulePhoto = SchedulePhoto.builder()
                                .schedule(schedule.get())
                                .member(findMember)
                                .imgUrl(fileUrl)
                                .imgName(OriginalName)
                                .build();

                        schedulePhotoRepository.save(schedulePhoto);
                    }
            );
        }

        SchedulePhotoRegisterResponseDto schedulePhotoRegisterResponseDto = SchedulePhotoRegisterResponseDto.builder()
                .scheduleId(schedule.get().getId())
                .build();

        return schedulePhotoRegisterResponseDto;
    }

    @Override
    public SchedulePhotoDeleteResponseDto deleteSchedulePhoto(Member findMember, Long schedulePhotoId) {

        Optional<SchedulePhoto> tmpSchedulePhoto = schedulePhotoRepository.findById(schedulePhotoId);
        scheduleValidator.checkSchedulePhotoExist(tmpSchedulePhoto);
        SchedulePhoto schedulePhoto = tmpSchedulePhoto.get();
        System.out.println("여기?");
        scheduleValidator.checkSchedulePhotoManager(schedulePhoto, findMember.getId());

        schedulePhotoRepository.delete(schedulePhoto);

        SchedulePhotoDeleteResponseDto schedulePhotoDeleteResponseDto = SchedulePhotoDeleteResponseDto.builder()
                .memberId(findMember.getId())
                .build();

        return schedulePhotoDeleteResponseDto;
    }

}
