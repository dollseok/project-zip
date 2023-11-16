package com.lastdance.ziip.plan.enums;

public enum PlanResponseMessage {

    PLAN_REGIST_SUCCESS("계획 등록 성공"),
    PLAN_DETAIL_SUCCESS("계획 상세 조회 성공"),
    PLAN_MODIFY_SUCCESS("계획 수정 성공"),
    PLAN_DELETE_SUCCESS("계획 삭제 성공"),
    PLAN_STATUS_MODIFY_SUCCESS("계획 상태코드 수정 성공");

    private final String message;

    PlanResponseMessage(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
