package com.lastdance.ziip.schedule.enums;

public enum ScheduleResponseMessage {

    SCHEDULE_REGIST_SUCCESS("일정 등록 성공"),
    SCHEDULE_LIST_SUCCESS("일정 리스트 조회 성공"),
    SCHEDULE_DETAIL_SUCCESS("일정 상세조회 성공"),
    SCHEDULE_MODIFY_SUCCESS("일정 수정 성공"),
    SCHEDULE_DELETE_SUCCESS("일정 삭제 성공");

    private final String message;


    ScheduleResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}

