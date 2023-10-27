package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.dto.request.ScheduleRegisterRequestDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleListResponseDto;
import com.lastdance.ziip.schedule.dto.response.ScheduleRegisterResponseDto;

public interface ScheduleService {

    ScheduleRegisterResponseDto registerSchedule(Member findMember, ScheduleRegisterRequestDto scheduleRegisterRequestDto);

    ScheduleListResponseDto listSchedule(Member findMember, long familyId);
}
