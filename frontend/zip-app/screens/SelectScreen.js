import { View, Text, Button } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectScreen({ navigation }) {
  
  useEffect(() => {
    // 비동기 함수를 정의
    const fetchAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log("localstorage에서 가져온 AccessToken : ", accessToken);
      console.log("localstorage에서 가져온 RefreshToken : ", refreshToken);
    };

    // 비동기 함수 호출
    fetchAccessToken();
  }, []); // 빈 dependency 배열로 한 번만 실행되게 함

  return (
    <View>
      <Text>가족 선택 화면</Text>
      <Text>가족 생성</Text>
      <Text>가족 등록</Text>
      <Button
        title="가족 페이지로 이동"
        onPress={() => navigation.navigate('홈')}
      />
    </View>
  );
}
