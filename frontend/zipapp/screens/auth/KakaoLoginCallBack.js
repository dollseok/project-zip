import { StyleSheet, View, Text, Button } from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REST_API_KEY, REDIRECT_URI} from '@env';
import axiosInstance from '../../util/Interceptor';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';

export default function KakaoLoginCallBack({ navigation }) {
	const route = useRoute();
  	const { code } = route.params;

	// // FCM 토큰을 가져오는 함수
	// const getFCMToken = async () => {

	// 	// const app = initializeApp(firebaseConfig);
	// 	await firebase.messaging().registerDeviceForRemoteMessages();
	// 	const fcmToken = await firebase.messaging().getToken();
	
	// 	console.log("firebase 토큰 : ", fcmToken);
	
	// 	sendFCMTokenToServer(fcmToken);
	//   };
	
	//   // 서버로 FCM 토큰을 전송하는 함수 (예: POST 요청)
	//   const sendFCMTokenToServer = async token => {
	// 	console.log("sendFCMTokenToServer로 들어온 token : ", token);
	// 	const receiveFCMTokenRequestDto = {
	// 	  fcmToken: token
	// 	};
	
	// 	try {
	// 	  axiosInstance
	// 		.post(`/notification/saveToken`, receiveFCMTokenRequestDto)
	// 		.then(response => {
	// 		  console.log("FCM Token 전송 응답 : ", response.data);
	// 		})
	// 		.catch(error => {
	// 		  console.log('토큰 전송 중, 에러 발생 : ', error);
	// 		});
	// 	} catch (error) {
	// 	  console.error('FCM 토큰 서버 전송 오류:', error);
	// 	}
	//   };
	//   const getCode = target => {
	// 	const exp = 'code=';
	// 	const condition = target.indexOf(exp);
	// 	if (condition !== -1) {
	// 	  const requestCode = target.substring(condition + exp.length);
	// 	  console.log('code = ', requestCode);
	// 	  requestToken(requestCode);
	// 	}
	//   };
	
	//   const requestToken = async code => {
	// 	// const requestTokenUrl = 'http://localhost:9090/api/members/kakao/login';
	// 	const requestTokenUrl = 'https://lastdance.kr/api/members/kakao/login';
	
	// 	try {
	// 	  const body = {
	// 		code,
	// 	  };
	// 	  const response = await axios.post(requestTokenUrl, body);
	
	// 	  console.log(response.headers);
	
	// 	  const accessToken = response.headers['authorization'];
	// 	  const refreshToken = response.headers['authorization-refresh'];
	
	// 	  if (accessToken) {
	// 		// AsyncStorage에 accessToken 저장
	// 		await AsyncStorage.setItem('accessToken', accessToken);
	
	// 		// FCM 토큰 가져오기 및 서버로 전송
	// 		getFCMToken().then(token => {
	// 		  if (token) {
	// 			sendFCMTokenToServer(token);
	// 		  }
	// 		});
	// 	  }
	
	// 	  if (refreshToken) {
	// 		// AsyncStorage에 refreshToken 저장
	// 		await AsyncStorage.setItem('refreshToken', refreshToken);
	// 	  }
	
	// 	  console.log(response.data);
	
	// 	  await navigation.navigate('가족선택');
	// 	} catch (e) {
	// 	  console.log(e);
	// 	}
	//   };

	useEffect(() => {
		// code를 사용하여 필요한 작업을 수행하십시오.
		console.log('Received code:', code);
	
		// 예를 들어, Axios를 사용하여 서버에 코드를 보낼 수 있습니다.
		// axios.post('your-api-endpoint', { code })
		//   .then(response => {
		//     // 처리 결과에 따른 작업 수행
		//   })
		//   .catch(error => {
		//     // 에러 처리
		//   });
	  }, [code]);

	  
	return (
		<View style={styles.container}>
			<Text>카카오 로그인 중..</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 50,
		backgroundColor: 'black'
	},
});
