package com.lastdance.ziip.family.enums;

public enum FamilyResponseMessage {

    FAMILY_REGIST_SUCCESS("가족 생성 성공"),
    FAMILY_ACCEPT_SUCCESS("가족 구성원 등록 성공");
    private final String message;


    FamilyResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

}
