package com.lastdance.ziip.plan.enums;

public enum Status {

    Pending("진행 전"),
    InProgress("진행 중"),
    Completed("완료");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    public String getValue(){
        return value;
    }
}
