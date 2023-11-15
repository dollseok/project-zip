import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../util/Interceptor';

export default function InputPhoneNumberScreen({navigation}) {
  const [familyId, setFamilyId] = useState([]);
  // familyCodes를 배열로 관리하여 다수의 입력값을 저장합니다.
  const [familyCodes, setFamilyCodes] = useState([]);
  const rotateValue = useRef(new Animated.Value(0)).current; // 초기 값 0

  const rotateAnimation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  // 새로운 연락처 입력 필드를 추가하는 함수입니다.
  const addNewField = () => {
    if (familyCodes.length < 4) {
      setFamilyCodes([...familyCodes, '']); // 새로운 입력값을 배열에 추가합니다.
    }
  };

  // 특정 index의 연락처를 업데이트하는 함수입니다.
  const updateFamilyCode = (text, index) => {
    const newFamilyCodes = [...familyCodes];
    newFamilyCodes[index] = text;
    setFamilyCodes(newFamilyCodes);
  };

  // '전송' 버튼 클릭 시 실행할 함수
  const handleSubmit = () => {
    // 여기에 전송 로직을 구현하세요.
    const familyInviteRequestDto = {
      familyId: familyId,
      phoneNumber: familyCodes,
    };

    console.log(familyInviteRequestDto);

    axiosInstance
      .post('/family/message', familyInviteRequestDto)
      .then(response => {
        console.log('메시지 전송 성공 : ', response);
        navigation.navigate('홈');
      })
      .catch(error => {
        console.error('가족 초대 메시지 전송 에러 : ', error);
      });
  };

  const removeField = indexToRemove => {
    const newFamilyCodes = [...familyCodes];
    newFamilyCodes.splice(indexToRemove, 1); // 해당 인덱스의 TextInput을 배열에서 제거
    setFamilyCodes(newFamilyCodes);
  };

  useEffect(() => {
    const animate = () => {
      // -15도에서 0도로
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000, // 1초
        useNativeDriver: true,
      }).start(() => {
        // 0도에서 -15도로
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 1000, // 1초
          useNativeDriver: true,
        }).start(animate); // 애니메이션 끝날 때마다 재시작
      });
    };

    animate(); // 애니메이션 시작

    return () => {
      rotateValue.stopAnimation(); // 컴포넌트 unmount 시 애니메이션 중지
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      setFamilyId(await AsyncStorage.getItem('familyId'));
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={{...styles.logo, transform: [{rotate: rotateAnimation}]}}>
        zip
      </Animated.Text>
      <View style={styles.conditionalContent}>
        <Text style={styles.familyText}>가족 초대</Text>
        {familyCodes.map((code, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="연락처를 입력하세요"
              onChangeText={text => updateFamilyCode(text, index)}
              value={code}
            />
            <TouchableOpacity onPress={() => removeField(index)}>
              <Text style={styles.removeButton}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {familyCodes.length < 4 && (
          <TouchableOpacity onPress={addNewField}>
            <Text style={styles.plusButton}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      {familyCodes.length > 0 ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>전송</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate('홈')}>
          <Text style={styles.submitButtonText}>생략</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    transform: [{rotate: '-15deg'}], // 이 부분을 추가합니다.
  },
  conditionalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  familyText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  plusButton: {
    fontSize: 30,
    marginTop: 20,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  inputText: {
    borderBottomWidth: 1,
    width: 180,
  },
  submitButton: {
    height: 50, // 높이 설정
    backgroundColor: 'black', // 배경색
    justifyContent: 'center', // 내부 텍스트 중앙 정렬
    alignItems: 'center',
    borderRadius: 10, // 둥근 테두리
    // marginTop: 270,
    // position: 'absolute', // 절대 위치 설정
    bottom: 0, // 하단
    left: 0, // 왼쪽
    right: 0, // 오른쪽
    margin: 40, // 주변 여백
  },
  submitButtonText: {
    color: 'white', // 텍스트 색상
    fontSize: 18, // 텍스트 크기
    fontWeight: 'bold', // 글씨 두께
  },
  familyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
});
