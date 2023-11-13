package com.lastdance.ziip.notification.service;

import com.lastdance.ziip.global.auth.oauth2.Messaging;
import com.lastdance.ziip.member.repository.MemberRepository;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.notification.dto.request.GptMessageRequestDto;
import com.lastdance.ziip.notification.dto.request.GptNotificationRequestDto;
import com.lastdance.ziip.notification.dto.request.GptRequestDto;
import com.lastdance.ziip.notification.dto.response.GptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GptService{

    private final MemberRepository memberRepository;

//    @Scheduled(cron="0 0 18 * * *", zone = "Asia/Seoul")
    public void postNotification() throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        // 1. fast api 호출
        String fastApiUrl = "https://lastdance.kr/fastapi/gpt";

        String question = restTemplate.getForObject(fastApiUrl, String.class, String.class);

//        GptResponseDto gptResponseDto = GptResponseDto.builder()
//                .question(question)
//                .build();
//
//        return gptResponseDto;

        String notificationUrl = "https://fcm.googleapis.com/v1/projects/lastdance-test/messages:send";
        HttpHeaders headers = new HttpHeaders();
        Messaging messaging = new Messaging();
        String header = messaging.getAccessToken();
        headers.set("Authorization", header);

        List<Member> memberList = memberRepository.findAll();

        for(Member member : memberList){
            if(member.getFcmToken() == null)
                continue;

            GptNotificationRequestDto notification = GptNotificationRequestDto.builder()
                    .title("새로운 일기를 써보세요")
                    .body(question)
                    .build();

            GptMessageRequestDto message = GptMessageRequestDto.builder()
                    .token(member.getFcmToken())
                    .notification(notification)
                    .build();

            GptRequestDto gptRequestDto = GptRequestDto.builder()
                    .message(message)
                    .build();

            HttpEntity<GptRequestDto> request = new HttpEntity<>(gptRequestDto, headers);
            RestTemplate tmpRestTemplate = new RestTemplate();

//            System.out.println(gptRequestDto.toString());

//            tmpRestTemplate.postForObject(notificationUrl, gptRequestDto, String.class);
            restTemplate.postForObject(notificationUrl, request, String.class);
        }
    }
}
