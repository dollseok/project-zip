package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.dto.response.CalenderYearResponseDto;

public interface CalenderService {
    CalenderYearResponseDto yearCalender(Member findMember, int year);
}
