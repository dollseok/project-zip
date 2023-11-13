import axios from 'axios';
import axiosInstance from '../util/Interceptor';
import {useRef, useEffect, useState} from 'react';
import axiosInstance from '../../util/Interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function sendNotification(purpose) {
  const familyId = await AsyncStorage.getItem('familyId');

  axiosInstance
    .get(`/members/getFcmToken?familyId=${familyId}`)
    .then(response => {
      const headers = {
        Authorization: `Bearer ` + response.data.data.googleAccessToken,
        'Content-Type': 'application/json',
      };

      const fcmUrl =
        'https://fcm.googleapis.com/v1/projects/lastdance-test/messages:send';

      response.data.data.fcmToken.forEach(token => {
        const message = {
          message: {
            token: token,
            notification: {
              title: purpose,
              body: purpose,
            },
          },
        };

        console.log('메시지 : ', message);

        axios
          .post(fcmUrl, message, {headers: headers})
          .then(response => {
            console.log('firebase 알림 전송 성공 : ', response);
          })
          .catch(error => {
            console.log('firebase 알림 전송 실패 : ', error);
          });
      });
    })
    .catch(error => {
      console.log('가족별 Fcm 토큰 조회 에러 : ', error);
    });

  return null;
}
