package com.lastdance.ziip.diary.enums;

public enum IsRead {

    READ("읽음"),
    UNREAD("안 읽음");

    private final String value;

    IsRead(String value) { this.value = value; }

    public String getValue() { return value; }
}
