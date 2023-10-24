import {WebView} from 'react-native-webview';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from "axios"

const REST_API_KEY = ''
// const REDIRECT_URI = 'https://auth.expo.io/@hyeongseoklee/zip-app'
const REDIRECT_URI = 'http://192.168.0.8:8081/auth/kakao/callback'

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginScreen({ navigation }) {
  const getCode = (target) => {
    const exp = 'code=';
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const requestCode = target.substring(condition + exp.length);
      console.log("code = ", requestCode);
      requestToken(requestCode);
    }
  };

  const requestToken = async (code) => {
    const requestTokenUrl = 'http://localhost:9090/api/auth/kakao';
  
    try {
      const body = {
        code,
      };
      const response = await axios.post(requestTokenUrl, body);
      console.log(response.data);
      // const value = response.data;
      // const result = await storeUser(value);
      // if (result === 'stored') {
      //   const user = await getData('user');
      //   dispatch(read_S(user));
      //   await navigation.navigate('Main');
      // }
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
        onMessage={event => {
          const data = event.nativeEvent.url;
          getCode(data);
        }}
      />
    </View>
  );
}