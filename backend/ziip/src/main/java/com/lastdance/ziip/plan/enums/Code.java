package com.lastdance.ziip.plan.enums;

public enum Code {

    Pending(0),
    InProgress(1),
    Completed(2);
    private final Integer value;

    Code(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }
}
