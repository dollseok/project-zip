package com.lastdance.ziip.family.enums;

public enum FamilyResponseMessage {

    FAMILY_REGIST_SUCCESS("가족 생성 성공");
    private final String message;


    FamilyResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

}
