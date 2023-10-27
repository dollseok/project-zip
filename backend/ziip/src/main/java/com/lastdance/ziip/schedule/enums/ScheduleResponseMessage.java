package com.lastdance.ziip.schedule.enums;

public enum ScheduleResponseMessage {

    SCHEDULE_REGIST_SUCCESS("일정 등록 성공"),
    SCHEDULE_LIST_SUCCESS("일정 리스트 조회 성공");

    private final String message;


    ScheduleResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}

