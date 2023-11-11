package com.lastdance.ziip.global.auth.oauth2;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.auth.oauth2.GoogleCredentials;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Messaging {

	@Value("${oauth2.google.scopes}")
	private String SCOPES;

	public String getAccessToken() throws IOException {
		GoogleCredentials googleCredentials = GoogleCredentials
			.fromStream(new FileInputStream("/serviceAccountKey.json"))
			.createScoped(Arrays.asList(SCOPES));

		googleCredentials.refreshIfExpired();

		return googleCredentials.getAccessToken().getTokenValue();
	}
}
