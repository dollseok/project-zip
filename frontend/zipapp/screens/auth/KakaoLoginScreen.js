import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View, Text, Button} from 'react-native';
import axios from 'axios';
import {REST_API_KEY, REDIRECT_URI} from '@env';
import axiosInstance from '../../util/Interceptor';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginScreen({navigation}) {
  // FCM 토큰을 가져오는 함수
  const getFCMToken = async () => {

    // const app = initializeApp(firebaseConfig);
    await firebase.messaging().registerDeviceForRemoteMessages();
    const fcmToken = await firebase.messaging().getToken();

    console.log("firebase 토큰 : ", fcmToken);

    // messaging
    //   .requestPermission()
    //   .then(function () {
    //     console.log('허가!');
    //     console.log(messaging.getToken());
    //   })
    //   .catch(function (err) {
    //     console.log('fcm에러 : ', err);
    //   });
  };

  // 서버로 FCM 토큰을 전송하는 함수 (예: POST 요청)
  const sendFCMTokenToServer = async token => {
    try {
      axiosInstance
        .post(`/notification/saveToken`, token)
        .then(response => {
          console.log('FCM 토큰 서버에 성공적으로 전송', response);
        })
        .catch(error => {
          console.log('토큰 전송 중, 에러 발생 : ', error);
        });
    } catch (error) {
      console.error('FCM 토큰 서버 전송 오류:', error);
    }
  };
  const getCode = target => {
    const exp = 'code=';
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const requestCode = target.substring(condition + exp.length);
      console.log('code = ', requestCode);
      requestToken(requestCode);
    }
  };

  const requestToken = async code => {
    // const requestTokenUrl = 'http://localhost:9090/api/members/kakao/login';
    const requestTokenUrl = 'https://lastdance.kr/api/members/kakao/login';

    try {
      const body = {
        code,
      };
      const response = await axios.post(requestTokenUrl, body);

      console.log(response.headers);

      const accessToken = response.headers['authorization'];
      const refreshToken = response.headers['authorization-refresh'];

      if (accessToken) {
        // AsyncStorage에 accessToken 저장
        await AsyncStorage.setItem('accessToken', accessToken);

        // FCM 토큰 가져오기 및 서버로 전송
        getFCMToken().then(token => {
          if (token) {
            sendFCMTokenToServer(token);
          }
        });
      }

      if (refreshToken) {
        // AsyncStorage에 refreshToken 저장
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }

      console.log(response.data);

      await navigation.navigate('가족선택');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=https://auth.expo.io/@hyeongseoklee/zip-app/auth/kakao/callback`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={event => {
          const data = event.nativeEvent.url;
          getCode(data);
        }}
      />
    </View>
  );
}
