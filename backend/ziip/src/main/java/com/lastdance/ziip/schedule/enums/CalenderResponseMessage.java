package com.lastdance.ziip.schedule.enums;

public enum CalenderResponseMessage {

    CALENDER_YEAR_SUCCESS("년도 조회 성공"),
    CALENDER_DAY_SUCCESS("일 상세 조회 성공");

    private final String message;


    CalenderResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}



