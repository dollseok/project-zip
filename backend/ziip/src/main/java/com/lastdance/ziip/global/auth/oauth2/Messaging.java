package com.lastdance.ziip.global.auth.oauth2;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
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

	@Value("${oauth2.google.service-key}")
	private String GOOGLE_SERVICE_KEY;


	public String getAccessToken() throws IOException {
		GoogleCredentials googleCredentials = GoogleCredentials
			.fromStream(new FileInputStream("src/main/resources/serviceAccountKey.json"))
			.createScoped(Arrays.asList(SCOPES));

		googleCredentials.refreshIfExpired();

		return googleCredentials.getAccessToken().getTokenValue();
	}
}
