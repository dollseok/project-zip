import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosFileInstance from '../../util/FileInterceptor';
import {TextInput} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import { validateText } from '../../components/check/ValidateText';

export default function FamilyInsertScreen({navigation}) {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [familyName, setFamilyName] = useState('');
  const [familyMessage, setFamilyMessage] = useState('');
  const [nickName, setNickname] = useState('');

  const [isfamilyNameViewVisible, setfamilyNameViewVisible] = useState(true);
  const [isMessageViewVisible, setMessageViewVisible] = useState(true);
  const [isNicknameViewVisible, setNicknameViewVisible] = useState(true);

  const rotateAnimation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const handleFamilyNameButtonPress = async () => {
	if (await validateText(familyName)) {
    	setfamilyNameViewVisible(false);
    	console.log('저장된 가족 이름:', familyName);
	}
  };

  const handleMessageButtonPress = async () => {
    if (await validateText(familyMessage)) {
      setMessageViewVisible(false);
      console.log('저장된 메시지:', familyMessage);
    }
  };

  const handleNicknameButtonPress = async () => {
    if (await validateText(nickName)) {
      setNicknameViewVisible(false);
      console.log('저장된 닉네임:', nickName);
    }
  };

  const selectImage = async BackgroudOrProfile => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;

        console.log(uri);

        return _uploadImage(uri, BackgroudOrProfile);
      }
    });
  };

  const _uploadImage = async uri => {
    const formData = new FormData();

    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    const familyRegisterRequest = {
      name: familyName,
      content: familyMessage,
      nickname: nickName,
    };

    formData.append(
      'familyRegisterRequest',
      JSON.stringify(familyRegisterRequest),
    );

    if (uri !== 'x') {
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('file', {
        uri: uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    } else {
      formData.append('file', null);
    }

    await axiosFileInstance
      .post('/family/register', formData)
      .then(response => {
        console.log(response.data);
        console.log('저장된 가족의 ID : ', response.data.data.id);
        AsyncStorage.setItem('familyId', JSON.stringify(response.data.data.id));
        navigation.navigate('초대할 가족 폰 번호 입력');
      })
      .catch(error => {
        console.error('가족 등록 에러: ', error);
      });
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

  return (
    <View style={styles.container}>
      <Animated.Text
        style={{...styles.logo, transform: [{rotate: rotateAnimation}]}}>
        zip
      </Animated.Text>
      <View>
        {isfamilyNameViewVisible ? (
          <View style={styles.conditionalContent}>
            <Text style={styles.familyText}>가족 이름 만들기</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="가족 이름을 설정하세요 (8자 이하)"
                onChangeText={text => setFamilyName(text)}
                value={familyName}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  (!familyName || familyName.length > 8) ? styles.buttonDisabled : styles.buttonEnabled,
                ]}
                onPress={handleFamilyNameButtonPress}
                disabled={!familyName || familyName.length > 8}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isMessageViewVisible ? (
          <View style={styles.conditionalContent}>
            <Text style={styles.familyText}>상태메시지 만들기</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="상태메시지를 설정하세요 (10자 이하)"
                onChangeText={text => setFamilyMessage(text)}
                value={familyMessage}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  (!familyMessage || familyMessage.length > 10) ? styles.buttonDisabled : styles.buttonEnabled,
                ]}
                onPress={handleMessageButtonPress}
                disabled={!familyMessage || familyMessage.length > 10}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isNicknameViewVisible ? (
          // 닉네임 입력 View
          <View style={styles.conditionalContent}>
            <Text style={styles.familyText}>닉네임 만들기</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="닉네임을 입력하세요 (6자 이하)"
                onChangeText={text => setNickname(text)}
                value={nickName}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  (!nickName || nickName.length > 6) ? styles.buttonDisabled : styles.buttonEnabled,
                ]}
                onPress={handleNicknameButtonPress}
                disabled={!nickName || nickName.length > 6}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.conditionalContent}>
            <Text style={styles.familyText}>배경사진 업로드</Text>
            <View style={[styles.imageContainer, {alignItems: 'center'}]}>
              <TouchableOpacity onPress={selectImage} disabled={!nickName}>
                <Image
                  source={require('../../assets/gallery.png')}
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: 'white',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => _uploadImage('x')}
                style={[
                  styles.button,
                  {marginTop: 30, backgroundColor: 'black'},
                ]}>
                <Text style={{color: 'white', fontWeight: 'bold', padding: 10}}>
                  이미지 생략
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 668023b (feat: 텍스트 정합 검사 코드 추가)
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
    transform: [{rotate: '-15deg'}],
    color: 'black',
  },
  conditionalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  familyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  inputText: {
    borderBottomWidth: 1,
    width: 200,
    color: 'black',
	fontSize: 12
  },
  button: {
    padding: 5,
    marginLeft: 10,
    borderRadius: 5, // 버튼 모서리 둥글게
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonEnabled: {
    backgroundColor: 'black',
  },
<<<<<<< HEAD
=======
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
		transform: [{ rotate: '-15deg' }],
		color: 'black'
	},
	conditionalContent: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 150,
	},
	familyText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 20,
		color: 'black'
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
	},
	imageContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 30,
	},
	inputText: {
		borderBottomWidth: 1,
		width: 180,
		color: 'black'
	},
	button: {
		padding: 5,
		marginLeft: 10,
		borderRadius: 5, // 버튼 모서리 둥글게
	},
	buttonDisabled: {
		backgroundColor: 'gray',
	},
	buttonEnabled: {
		backgroundColor: 'black',
	},
>>>>>>> 494e7f8 (feat: 일정 리스트 유저 닉네임, 메인화면에서 가족 리스트로 이동하는 버튼 추가)
=======
>>>>>>> 668023b (feat: 텍스트 정합 검사 코드 추가)
});
