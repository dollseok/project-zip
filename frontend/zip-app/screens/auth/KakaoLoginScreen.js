import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from 'axios';
import {REST_API_KEY, REDIRECT_URI} from '@env';

// const REDIRECT_URI = 'https://auth.expo.io/@hyeongseoklee/zip-app'
// const REDIRECT_URI = 'http://172.20.10.3:8081/auth/kakao/callback';
// const REDIRECT_URI = 'http://192.168.31.236:8081/auth/kakao/callback';
// const REDIRECT_URI = 'http://localhost:8081/auth/kakao/callback';

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginScreen({ navigation }) {
	const getCode = (target) => {
		const exp = 'code=';
		const condition = target.indexOf(exp);
		if (condition !== -1) {
			const requestCode = target.substring(condition + exp.length);
			console.log('code = ', requestCode);
			requestToken(requestCode);
		}
	};

	const requestToken = async (code) => {
		const requestTokenUrl = 'http://10.0.2.2:8080/api/members/kakao/login';
		// const requestTokenUrl = 'http://localhost:8080/api/members/kakao/login';

		try {
			const body = {
				code,
			};
			const response = await axios.post(requestTokenUrl, body);

			console.log(response.headers);

			const accessToken = response.headers["authorization"];
			const refreshToken = response.headers["authorization-refresh"];

			if (accessToken) {
				// AsyncStorage에 accessToken 저장
				await AsyncStorage.setItem('accessToken', accessToken);
			}

			if (refreshToken) {
				// AsyncStorage에 refreshToken 저장
				await AsyncStorage.setItem('refreshToken', refreshToken);
			}

			await navigation.navigate('가족선택');
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<WebView
				style={{ flex: 1 }}
				source={{
					uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
				}}
				injectedJavaScript={INJECTED_JAVASCRIPT}
				javaScriptEnabled
				onMessage={(event) => {
					const data = event.nativeEvent.url;
					getCode(data);
				}}
			/>
		</View>
	);
}
