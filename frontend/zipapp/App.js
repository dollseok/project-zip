// Android 또는 iOS용으로 빌드하는 경우 프로덕션 단계에서 앱이 중단될 수 있기 때문에 무조건 넣어줘야함.
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// 화면이동
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import StackNavigator from './screens/navigation/StackNavigator';

// Recoil
import {RecoilRoot} from 'recoil';

// 기본 글꼴 설정
import {setCustomText} from 'react-native-global-props';

const customTextProps = {
  style: {
    fontFamily: 'Pretendard-Regular',
    letterSpacing: -0.4,
  },
};

setCustomText(customTextProps);

// 화면 배경색 변경
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);

      // 알림을 표시
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <RecoilRoot>
      <NavigationContainer theme={navTheme}>
        <StackNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}
