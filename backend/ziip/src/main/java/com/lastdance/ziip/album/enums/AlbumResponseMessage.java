package com.lastdance.ziip.album.enums;

public enum AlbumResponseMessage {

    ALBUM_LIST_SUCCESS("사진첩 전체 조회 성공"),

    ALBUM_MONTH_SUCCESS("사진첩 월별 조회 성공");

    private final String message;
    AlbumResponseMessage(String message) { this.message = message; }
    public String getMessage() { return message;}


}
