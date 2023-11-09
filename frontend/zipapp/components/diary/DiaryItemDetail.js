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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import * as ImagePicker from 'expo-image-picker';
// 카메라, 앨범 접근 라이브러리
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosFileInstance from '../../util/FileInterceptor';

export default function DiaryItemDetail(props) {
  const {
    selectedYear,
    selectedMonth,
    createModalVisible,
    setCreateModalVisible,
    diary,
  } = props;

  // console.log('일기 상세 데이터: ', diary);

  const formatDiaryDay = createdAt => {
    return new Date(createdAt).getDate();
  };

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

  useEffect(() => {
    if (props.createModalVisible) {
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

  // 인풋 관련 설정
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryEmotion, setDiaryEmotion] = useState(1);
  const [diaryComment, setDiaryComment] = useState('');

  // // 사진 업로드
  const [image, setImage] = useState([]);

  return (
    <Modal
      visible={createModalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
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
            imageStyle={{opacity: 0.65}}
            source={
              diary?.diaryPhotos && diary?.diaryPhotos.length != 0
                ? {uri: diary.diaryPhotos[0].imgUrl}
                : require('../../assets/background.jpg')
            }>
            <View style={styles.createFormContainer}>
              {/* 취소 & 등록 버튼 */}
              <View style={styles.buttonContainer}>
                {/* 취소 버튼 */}
                <TouchableOpacity
                  style={styles.cancelButton}></TouchableOpacity>
                {/* 편집 버튼 */}
                <TouchableOpacity style={styles.writeButton}>
                  <Text>편집</Text>
                </TouchableOpacity>
              </View>
              {/* 감정 선택 */}
              <View style={styles.dayEmotionContainer}>
                <View style={styles.dayContainer}>
                  <View>
                    <Text style={{fontSize: 40, fontWeight: 'bold'}}>
                      {formatDiaryDay(diary.createdAt)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{fontSize: 15}}>일</Text>
                  </View>
                </View>
                <View style={styles.emotionContainer}></View>
              </View>
              {/* 제목 및 내용 */}
              <View style={styles.contentContainer}>
                <View style={styles.diaryTitleContainer}>
                  <Text style={{fontSize: 18, fontWeight: '700'}}>
                    {diary.title}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={{fontSize: 15, fontWeight: '300'}}>
                    {diary.content}
                  </Text>
                </View>
              </View>
              {/* 댓글 */}
              <View style={styles.commentContainer}>
                <View style={styles.commentSubtitle}>
                  <Text>댓글</Text>
                </View>
                <View style={styles.commentList}>
                  <Text>댓글 리스트</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={{
                      borderBottomWidth: 1,
                      borderColor: 'gray',
                      width: '60%',
                    }}
                    onChangeText={text => {
                      setDiaryComment(text);
                    }}
                    value={diaryComment}
                  />
                  <TouchableOpacity>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
      </View>
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
  dayEmotionContainer: {
    gap: 20,
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
  titleInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,

    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  contentInput: {
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
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
