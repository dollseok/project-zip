package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.dto.request.ScheduleDeleteRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleModifyRequestDto;
import com.lastdance.ziip.schedule.dto.request.SchedulePhotoRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ScheduleService {

    ScheduleRegisterResponseDto registerSchedule(Member findMember, ScheduleRegisterRequestDto scheduleRegisterRequestDto);

    ScheduleListResponseDto listSchedule(Member findMember, long familyId);

    ScheduleDetailResponseDto detailSchedule(Member findMember, long scheduleId);

    ScheduleModifyResponseDto modifySchedule(Member findMember, ScheduleModifyRequestDto scheduleModifyRequestDto);

    ScheduleDeleteResponseDto deleteService(Member findMember, ScheduleDeleteRequestDto scheduleDeleteRequestDto);

    SchedulePhotoRegisterResponseDto registSchedulePhoto(Member findMember, List<MultipartFile> files, SchedulePhotoRegisterRequestDto requestDto);

    SchedulePhotoDeleteResponseDto deleteSchedulePhoto(Member findMember, Long schedulePhotoId);
}
