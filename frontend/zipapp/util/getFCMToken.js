import messaging from '@react-native-firebase/messaging';

// FCM 토큰을 가져오는 함수
const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('FCM 토큰 가져오기 실패:', error);
    return null;
  }
};

// 서버로 FCM 토큰을 전송하는 함수 (예: POST 요청)
const sendFCMTokenToServer = async (token) => {
  try {
    const memberId = 123; // 사용자 ID
    const response = await fetch('https://your-server/api/fcm/saveToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId, firebaseToken: token }),
    });

    if (response.status === 200) {
      console.log('FCM 토큰 서버에 성공적으로 전송');
    } else {
      console.error('FCM 토큰 서버 전송 실패');
    }
  } catch (error) {
    console.error('FCM 토큰 서버 전송 오류:', error);
  }
};

// FCM 토큰 가져오기 및 서버로 전송
getFCMToken()
  .then((token) => {
    if (token) {
      sendFCMTokenToServer(token);
    }
  });