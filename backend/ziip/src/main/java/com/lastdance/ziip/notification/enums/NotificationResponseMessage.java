package com.lastdance.ziip.notification.enums;

public enum NotificationResponseMessage {
	NOTIFICATION_RECEIVE_SUCCESS("FCM Token 저장 성공");
	private final String message;

	NotificationResponseMessage(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}
