package com.lastdance.ziip.global.auth.oauth2;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

	//	@Value("${oauth2.google.service-key}")
	//	private String GOOGLE_SERVICE_KEY;

	@Value("${oauth2.google.target-directory}")
	private String GOOGLE_SERVICE_KEY_DIRECTORY;

	public String getAccessToken() throws IOException {
		//		downloadFile(GOOGLE_SERVICE_KEY, GOOGLE_SERVICE_KEY_DIRECTORY);

		GoogleCredentials googleCredentials = GoogleCredentials
			.fromStream(new FileInputStream(GOOGLE_SERVICE_KEY_DIRECTORY))
			.createScoped(Arrays.asList(SCOPES));

		googleCredentials.refreshIfExpired();

		return googleCredentials.getAccessToken().getTokenValue();
	}

	public static void downloadFile(String fileURL, String targetDirectory) throws IOException {
		URL url = new URL(fileURL);
		try (InputStream in = url.openStream();
			 FileOutputStream fos = new FileOutputStream(targetDirectory)) {
			byte[] buffer = new byte[1024];
			int bytesRead;

			while ((bytesRead = in.read(buffer)) != -1) {
				fos.write(buffer, 0, bytesRead);
			}
		}
	}
}
