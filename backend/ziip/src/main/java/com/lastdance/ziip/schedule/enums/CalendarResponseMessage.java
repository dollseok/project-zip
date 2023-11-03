package com.lastdance.ziip.schedule.enums;

public enum CalendarResponseMessage {

    CALENDAR_YEAR_SUCCESS("년도 조회 성공"),
    CALENDAR_DAY_SUCCESS("일 상세 조회 성공"),
    CALENDAR_MONTH_SUCCESS("월별 상세 조회 성공");

    private final String message;


    CalendarResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}



