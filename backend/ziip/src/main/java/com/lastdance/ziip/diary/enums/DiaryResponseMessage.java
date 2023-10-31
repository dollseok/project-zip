package com.lastdance.ziip.diary.enums;

public enum DiaryResponseMessage {

    DIARY_WRITE_SUCCESS("일기 작성 성공");
    private final String message;

    DiaryResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}
