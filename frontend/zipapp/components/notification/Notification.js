import axios from 'axios';
import {useRef, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function sendNotification(purpose) {
  const familyId = AsyncStorage.getItem('familyId');
  const [fcmToken, setFcmToken] = useState([]);
  const [googleAccessToken, setGoogleAccessToken] = useState([]);

  axiosInstance
    .get(`/members/getFcmToken?familyId=${familyId}`)
    .then(response => {
      setFcmToken(response.data.data.fcmToken);
      setGoogleAccessToken(response.data.data.googleAccessToken);
    })
    .catch(error => {
      console.log('가족별 Fcm 토큰 조회 에러 : ', error);
    });

  const headers = {
    Authorization: `Bearer ` + googleAccessToken,
    'Content-Type': 'application/json',
  };

  const fcmUrl =
    'https://fcm.googleapis.com/v1/projects/lastdance-test/messages:send';

    const message = {
        message: {
          token: fcmToken,
          notification: {
            title: purpose,
            body: purpose,
          },
        },
      };

  axios
    .post(fcmUrl, message, {headers: headers})
    .then(response => {
      console.log('firebase 알림 전송 성공 : ', response);
    })
    .catch(error => {
      console.log('firebase 알림 전송 실패 : ', error);
    });
}
