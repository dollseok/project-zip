package com.lastdance.ziip.family.enums;

public enum FamilyResponseMessage {

    FAMILY_REGIST_SUCCESS("가족 생성 성공"),
    FAMILY_ACCEPT_SUCCESS("가족 구성원 등록 성공"),
    FAMILY_LIST_SUCCESS("가족 리스트 조회 성공"),
    FAMILY_NICKNAME_SUCCESS("가족 내 닉네임 변경 성공"),
    FAMILY_CHOICE_SUCCESS("가족 선택 성공"),
    FAMILY_MODIFY_SUCCESS("가족 정보 수정 성공"),
    FAMILY_MEMBER_SECCESS("가족 멤버 조회 성공"),
    FAMILY_CHECK_SUCCESS("가족 코드 체크 성공");
    private final String message;


    FamilyResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

}
