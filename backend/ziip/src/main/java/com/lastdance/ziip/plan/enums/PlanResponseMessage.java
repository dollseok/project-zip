package com.lastdance.ziip.plan.enums;

public enum PlanResponseMessage {

    PLAN_REGIST_SUCCESS("계획 등록 성공"),
    PLAN_DETAIL_SUCCESS("계획 상세 조회 성공");

    private final String message;

    PlanResponseMessage(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
