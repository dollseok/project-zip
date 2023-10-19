package com.lastdance.ziip.member.enums;

public enum Role {
    ADMIN("admin"),
    USER("user"),
    DELETED("deleted");

    private final String value;

    Role(String value){this.value=value;}
    public String getValue(){return value;}
}
