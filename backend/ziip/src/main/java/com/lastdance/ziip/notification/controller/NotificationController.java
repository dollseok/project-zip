package com.lastdance.ziip.notification.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.notification.dto.request.ReceiveFCMTokenRequestDto;
import com.lastdance.ziip.notification.dto.response.ReceiveFCMTokenResponseDto;
import com.lastdance.ziip.notification.enums.NotificationResponseMessage;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Notification", description = "Notification 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/notification")
public class NotificationController {

	@Operation(summary = "FCM Token 테스트", description = "기기별 FCM Token을 프론트에게 받는 API")
	@PostMapping("/saveToken")
	public ResponseEntity<ResponseTemplate<ReceiveFCMTokenResponseDto>> receiveFCMToken(HttpServletRequest httpServletRequest,
		@RequestBody ReceiveFCMTokenRequestDto receiveFCMTokenRequestDto) {


		ReceiveFCMTokenResponseDto responseDto = ReceiveFCMTokenResponseDto.builder()
			.fcmToken(receiveFCMTokenRequestDto.getFcmToken())
			.build();

		return new ResponseEntity<>(
			ResponseTemplate.<ReceiveFCMTokenResponseDto>builder()
				.msg(NotificationResponseMessage.NOTIFICATION_RECEIVE_SUCCESS.getMessage())
				.data(responseDto)
				.result(true)
				.build(), HttpStatus.OK
		);
	}
}
