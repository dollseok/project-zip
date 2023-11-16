package com.lastdance.ziip.album.enums;

public enum ImageCategory {

    DIARY("일기"),
    SCHEDULE("일정");

    private final String value;

    ImageCategory(String value) { this.value = value;}

    public String getValue() {return value;}
}
