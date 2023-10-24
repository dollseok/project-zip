package com.lastdance.ziip.plan.enums;

public enum Code {

    Pending(1),
    InProgress(2),
    Completed(3);
    private final Integer value;

    Code(Integer value){ this.value = value; }
    public Integer getValue(){return value;}
}
