package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.dto.request.CalendarDayRequestDto;
import com.lastdance.ziip.schedule.dto.response.CalendarDayResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalendarMonthResponseDto;
import com.lastdance.ziip.schedule.dto.response.CalendarYearResponseDto;

public interface CalendarService {
    CalendarYearResponseDto yearCalendar(Member findMember, int year, Long familyId);

    CalendarDayResponseDto dayCalendar(Member findMember, String todayDate , Long familyId);

    CalendarMonthResponseDto monthCalendar(Member findMember, int year, int month , Long familyId);
}
