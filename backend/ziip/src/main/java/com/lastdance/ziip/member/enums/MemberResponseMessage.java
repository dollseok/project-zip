package com.lastdance.ziip.member.enums;

public enum MemberResponseMessage {

    MEMBER_GETALLMEMBER_SUCCESS("회원 모든 정보 조회 성공"),
    MEMBER_FCMTOKEN_SUCCESS("가족별 회원 Fcm 토큰 조회 성공");
    private final String message;


    MemberResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

}
