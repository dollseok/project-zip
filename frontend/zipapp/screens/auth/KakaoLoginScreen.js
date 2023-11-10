import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View, Text, Button} from 'react-native';
import axios from 'axios';
import {REST_API_KEY, REDIRECT_URI} from '@env';
import firebase from '@react-native-firebase/app';
// import * as firebase from '@react-native-firebase/app'
import * as getMessaging from '@react-native-firebase/messaging';

// import admin from 'firebase-admin';
// import serviceAccount from '../../serviceAccountKey.json';

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginScreen({navigation}) {

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
      // FCM 토큰 가져오기 및 서버로 전송
      await firebase.messaging().registerDeviceForRemoteMessages();
      const fcmToken = await firebase.messaging().getToken();
      await firebase.messaging().sendMessage()

      console.log('firebase 토큰 : ', fcmToken);

      const codeRequest = {
        code: code,
        fcmToken: fcmToken,
      };

      const response = await axios.post(requestTokenUrl, codeRequest);

      console.log(response.headers);

      const accessToken = response.headers['authorization'];
      const refreshToken = response.headers['authorization-refresh'];

      if (accessToken) {
        // AsyncStorage에 accessToken 저장
        await AsyncStorage.setItem('accessToken', accessToken);
      }

      if (refreshToken) {
        // AsyncStorage에 refreshToken 저장
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }

      console.log(response.data);

      const admin = require('firebase-admin');

      // admin.initializeApp({
      //   credential: admin.credential.cert(serviceAccount)
      // });

      // const googleAccessToken = await admin.credential.applicationDefault().getAccessToken();

      // console.log("구글에서 발급받은 토큰 : ", googleAccessToken);

      // var serviceAccount = require("path/to/serviceAccountKey.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });


      const message = {
        'message': {
          notification: {
            title: '하진아 안녕',
            body: '하진아 안녕',
          },
          tokens:
            'cGLJ1LXkQ8Whr4vpOn_GRZ:cGLJ1LXkQ8Whr4vpOn_GRZ:APA91bFAKk2uG2QPrntVFLobIy_rQvBZxVCxm9DFMZe3RrIlbPMH3s7Y4T764uNr4EfMMa6VRmKBfBfElt46jtUB1mqdtiereKP0b2I7jQPd8ZDbVH8J7xeXsk5_rL6B2by9MAmbGCNw', // 여러 개의 토큰을 배열로 전달
        },
      };
    
      getMessaging().send(message).then(response => {
            console.log('메시지 전송 성공 : ', response);
          })
          .catch(error => {
            console.log('Firebase 전송 실패 : ', error);
          });

      // firebase
      //   .messaging()
      //   .sendMessage(message)
      //   .then(response => {
      //     console.log('메시지 전송 성공 : ', response);
      //   })
      //   .catch(error => {
      //     console.log('Firebase 전송 실패 : ', error);
      //   });
      // try {
      //   const firebaseResponse = await admin.messaging().sendMulticast(message);
      //   console.log('Successfully sent message:', firebaseResponse);
      // } catch (error) {
      //   console.log('Error sending message:', error);
      // }

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
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
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
