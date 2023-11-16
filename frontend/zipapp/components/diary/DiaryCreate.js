import {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  TextInput,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import * as ImagePicker from 'expo-image-picker';
// 카메라, 앨범 접근 라이브러리
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosFileInstance from '../../util/FileInterceptor';
import refreshState from '../../atoms/refreshState';
import {useRecoilState} from 'recoil';
// import * as Notification from '../notification/Notification';

export default function DiaryCreate(props) {
  const {
    selectedYear,
    selectedMonth,
    createModalVisible,
    setCreateModalVisible,
  } = props;

  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetDiaryCreate = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });
  const closeDiaryCreate = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetDiaryCreate.start();
        }
      },
    }),
  ).current;

  const [refresh, setRefresh] = useRecoilState(refreshState);

  useEffect(() => {
    if (props.createModalVisible) {
      setImage([]);
      resetDiaryCreate.start();
    } else {
      closeDiaryCreate.start();
    }
  }, [props.createModalVisible]);

  const closeModal = () => {
    closeDiaryCreate.start(() => {
      setCreateModalVisible(false);
    });
  };

  // // 일자 선택 설정
  // 연월 정보를 기반으로 일 수 계산
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  // 일자 리스트 생성
  const dateList = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dateList.push(day);
  }

  // // 감정 선택 설정
  // 초기 감정 상태 설정
  const [selectedEmotion, setSelectedEmotion] = useState('smile');

  // 감정을 선택하는 함수
  const selectEmotion = emotion => {
    setSelectedEmotion(emotion);
  };
  // 감정이 선택되었는지 확인하는 함수
  const isEmotionSelected = emotion => {
    return selectedEmotion === emotion;
  };

  const resetInput = async () => {
    await setDiaryTitle('');
    await setDiaryContent('');
    await setDiaryEmotion(1);
  };

  // 인풋 관련 설정
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryEmotion, setDiaryEmotion] = useState(1);

  // // 사진 업로드
  const [image, setImage] = useState([]);

  const uploadImage = async () => {
    console.log('갤러리 접근');
    // React native 0.60 이상부터는 auto linking을 지원하기 때문에 카메라 권한등을 따로 설정할 필요가 없다.
    // launchImageLibrary: 사용자 앨범 접근

    await launchImageLibrary({}, res => {
      if (res.didCancel) {
        console.log('이미지 선택 취소');
        setImage([]);
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorCode);
      } else if (res.assets) {
        // 정상적으로 사진 반환받았을 때
        console.log('ImagePicker res: ', res);
        // console.log(res.assets[0].uri.replace('//', ''));
        setImage({
          uri: res.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }
    });
  };

  const writeDiary = async () => {
    const formData = new FormData();
    console.log('formData 생성');

    const familyId = await AsyncStorage.getItem('familyId');

    const diaryWriteRequestDto = {
      familyId: familyId,
      title: diaryTitle,
      content: diaryContent,
      emotionId: diaryEmotion,
    };

    // 이미지 파일 담기
    if (image.uri) {
      console.log('업로드할 사진: ', image);
      formData.append('files', image);
    } else {
      console.log('이미지 없습니당');
    }

    // 파일 외 다른 값들 넣어주기
    console.log('입력값들: ', diaryWriteRequestDto);
    formData.append('diaryWriteRequest', {
      string: JSON.stringify(diaryWriteRequestDto),
      type: 'application/json',
    });

    await axiosFileInstance
      .post(`/diary/write`, formData)
      .then(res => {
        console.log(res.data.msg);
        if (res.data.msg === '일기 작성 성공') {
          closeModal();
          setRefresh(refresh => refresh * -1);
        }
      })
      .catch(err => {
        console.log(err);
      });

    // Notification.sendNotification('새로운 일기가 작성되었습니다.');
  };

  return (
    <Modal
      visible={createModalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          <ImageBackground
            style={styles.bgImage}
            imageStyle={{opacity: 0.8}}
            source={
              image ? {uri: image.uri} : require('../../assets/background.jpg')
            }>
            <View style={styles.createFormContainer}>
              {/* 취소 & 등록 버튼 */}
              <View style={styles.buttonContainer}>
                {/* 취소 버튼 */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}>
                  <Text style={styles.cancelFont}>취소</Text>
                </TouchableOpacity>
                {/* 등록 버튼 */}
                <TouchableOpacity
                  style={styles.writeButton}
                  onPress={writeDiary}>
                  <Text style={styles.writeFont}>완료</Text>
                </TouchableOpacity>
              </View>
              {/* 감정 선택 */}
              <View style={styles.dayEmotionContainer}>
                <View style={styles.dayContainer}>
                  <View>
                    <Text style={styles.dayFont}>{new Date().getDate()}</Text>
                  </View>
                  <View>
                    <Text style={styles.dayUnitFont}>일</Text>
                  </View>
                </View>
                <View style={styles.emotionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      selectEmotion('smile');
                      setDiaryEmotion(1);
                    }}>
                    <Image
                      style={[
                        styles.emotionIcon,
                        isEmotionSelected('smile')
                          ? null
                          : styles.blurEmotionIcon,
                      ]}
                      source={require('../../assets/emotion/smile.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      selectEmotion('wow');
                      setDiaryEmotion(2);
                    }}>
                    <Image
                      style={[
                        styles.emotionIcon,
                        isEmotionSelected('wow')
                          ? null
                          : styles.blurEmotionIcon,
                      ]}
                      source={require('../../assets/emotion/wow.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      selectEmotion('sad');
                      setDiaryEmotion(3);
                    }}>
                    <Image
                      style={[
                        styles.emotionIcon,
                        isEmotionSelected('sad')
                          ? null
                          : styles.blurEmotionIcon,
                      ]}
                      source={require('../../assets/emotion/sad.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      selectEmotion('angry');
                      setDiaryEmotion(4);
                    }}>
                    <Image
                      style={[
                        styles.emotionIcon,
                        isEmotionSelected('angry')
                          ? null
                          : styles.blurEmotionIcon,
                      ]}
                      source={require('../../assets/emotion/angry.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* 제목 및 내용 입력 */}
              <View style={styles.contentContainer}>
                <TextInput
                  placeholder="제목"
                  style={styles.titleInput}
                  onChangeText={text => {
                    setDiaryTitle(text);
                  }}
                  value={diaryTitle}
                />
                <TextInput
                  placeholder="내용"
                  style={styles.contentInput}
                  onChangeText={content => {
                    setDiaryContent(content);
                  }}
                  multiline={true}
                  numberOfLines={4}
                  value={diaryContent}
                />
              </View>
              {/* 사진 업로드 */}
              <View style={styles.photoUpload}>
                <TouchableOpacity onPress={() => uploadImage()}>
                  <Ionicons name="camera-outline" size={40} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
        <TouchableWithoutFeedback>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  createFormContainer: {
    padding: 20,
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelFont: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#D93939',
  },
  writeFont: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
    color: '#727272',
  },
  dayEmotionContainer: {
    gap: 20,
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayFont: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 40,
  },
  dayUnitFont: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
  },
  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    gap: 10,
  },
  emotionIcon: {
    width: 28,
    height: 28,
  },
  blurEmotionIcon: {
    opacity: 0.5,
  },
  contentContainer: {},
  titleInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,

    borderBottomWidth: 1,
    borderColor: 'gray',

    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
  },
  contentInput: {
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',

    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
  },
  photoUpload: {
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 15,
    zIndex: -10,
    position: 'absolute',
  },
});
