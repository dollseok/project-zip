import {useRef, useEffect, useState} from 'react';
import {
  View,
  Alert,
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
  ScrollView,
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
import axiosInstance from '../../util/Interceptor';

import refreshState from '../../atoms/refreshState';
import {useRecoilState} from 'recoil';
import {createIconSetFromFontello} from 'react-native-vector-icons';

export default function DiaryItemDetail(props) {
  const {
    selectedYear,
    selectedMonth,
    createModalVisible,
    setCreateModalVisible,
    diary,
  } = props;

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

  // 수정 <-> 상세 조회
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const toggleUpdateMode = async () => {
    await getMemberId();
    console.log('본인의 memberId: ', myId);
    if (myId === diary.memberId) {
      setIsUpdateMode(!isUpdateMode);
    } else {
      Alert.alert('', '본인이 작성한 일기가 아닙니다.');
    }
  };

  // // 상세 조회 시 // //

  // 1. 댓글
  const [diaryComment, setDiaryComment] = useState(''); // 댓글 입력값

  const writeComment = () => {
    // 댓글 작성
    const diaryCommentWriteRequestDto = {
      diaryId: diary.diaryId,
      content: diaryComment,
    };

    // console.log('댓글 작성 dto: ', diaryCommentWriteRequestDto);

    axiosInstance
      .post(`/diary/comment/write`, JSON.stringify(diaryCommentWriteRequestDto))
      .then(res => {
        console.log(res.data.msg);
        if (res.data.msg === '일기 댓글 작성 성공') {
          setRefresh(refresh => refresh * -1);
          setDiaryComment('');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // // 수정 시 // //

  // 1. 제목, 내용
  const [diaryTitle, setDiaryTitle] = useState(''); // 제목
  const [diaryContent, setDiaryContent] = useState(''); // 내용

  // 2. 감정 선택

  // 초기 감정 상태 설정
  const [diaryEmotion, setDiaryEmotion] = useState(1); // 감정 id
  const [selectedEmotion, setSelectedEmotion] = useState('smile');

  // 감정을 선택하는 함수
  const selectEmotion = emotion => {
    setSelectedEmotion(emotion);
  };
  // 감정이 선택되었는지 확인하는 함수
  const isEmotionSelected = emotion => {
    return selectedEmotion === emotion;
  };
  const selectedEmotionUrl = selectedEmotion => {
    if (selectedEmotion === 'smile') {
      return require(`../../assets/emotion/smile.png`);
    } else if (selectedEmotion === 'wow') {
      return require(`../../assets/emotion/wow.png`);
    } else if (selectedEmotion === 'sad') {
      return require(`../../assets/emotion/sad.png`);
    } else if (selectedEmotion === 'angry') {
      return require(`../../assets/emotion/angry.png`);
    }
  };

  // 3. 사진 업로드
  const [image, setImage] = useState([]);

  const uploadImage = async () => {
    console.log('갤러리 접근');
    // React native 0.60 이상부터는 auto linking을 지원하기 때문에 카메라 권한등을 따로 설정할 필요가 없다.
    // launchImageLibrary: 사용자 앨범 접근

    await launchImageLibrary({}, res => {
      if (res.didCancel) {
        setImage([]);
        console.log('이미지 선택 취소');
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

  const onLoadPrevData = () => {
    setDiaryTitle(diary.title);
    setDiaryContent(diary.content);
    if (diary.emotionId === 1) {
      setSelectedEmotion('smile');
    } else if (diary.emotionId === 2) {
      setSelectedEmotion('wow');
    } else if (diary.emotionId === 3) {
      setSelectedEmotion('sad');
    } else if (diary.emotionId === 4) {
      setSelectedEmotion('angry');
    }
    setDiaryEmotion(diary.emotionId);
  };

  useEffect(() => {
    if (diary) {
      onLoadPrevData();
    }
  }, [diary]);

  // 일기 수정 화면에서의 배경이미지 uri
  const imgOnModify = diary => {
    if (image && image.uri) {
      return {uri: image.uri};
    }
    if (diary.diaryPhotos && diary.diaryPhotos.length !== 0) {
      console.log(diary.diaryPhotos[0].imgUrl);
      return {uri: diary.diaryPhotos[0].imgUrl};
    } else {
      return require('../../assets/background.jpg');
    }
  };
  // console.log(imgOnModify(diary));

  const [refresh, setRefresh] = useRecoilState(refreshState);

  const [myId, setMyId] = useState('');

  // 접속한 유저의 멤버 id 가져오기
  const getMemberId = async () => {
    const familyId = await AsyncStorage.getItem('familyId');

    axiosInstance
      .get(`/family/mypage`, {
        params: {
          familyId: familyId,
        },
      })
      .then(res => {
        console.log('접속한 유저의 MemberId: ', res.data.data.memberId);
        setMyId(res.data.data.memberId);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // 일기 수정 요청
  const updateDiary = async () => {
    const formData = new FormData();

    const familyId = await AsyncStorage.getItem('familyId');

    const diaryModifyRequestDto = {
      diaryId: diary.diaryId,
      familyId: familyId,
      title: diaryTitle,
      content: diaryContent,
      emotionId: diaryEmotion,
    };

    // 이미지 파일 담기
    if (image.uri) {
      console.log('업로드할 사진: ', image);
      formData.append('file', image);
    } else {
      console.log('이미지 없습니당');
    }

    // 파일 외 다른 값들 넣어주기
    console.log('수정할 입력값들: ', diaryModifyRequestDto);
    formData.append('diaryModifyRequest', {
      string: JSON.stringify(diaryModifyRequestDto),
      type: 'application/json',
    });

    axiosFileInstance
      .put(`/diary/modify`, formData)
      .then(res => {
        console.log(res.data.msg);
        if (res.data.msg === '일기 수정 성공') {
          closeModal();
          setRefresh(refresh => refresh * -1);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onDelete = () => {
    // console.log('일기 id: ', diary.diaryId);
    axiosInstance
      .delete(`/diary/delete`, {
        params: {
          diaryId: diary.diaryId,
        },
      })
      .then(res => {
        console.log(res.data.msg);
        if (res.data.msg === '일기 삭제 성공') {
          closeModal();
          setRefresh(refresh => refresh * -1);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // 일기 삭제 요청
  const deleteDiary = () => {
    Alert.alert(
      '',
      '정말로 삭제하시겠습니까?',
      [
        {text: '취소', onPress: () => {}, style: 'cancel'},
        {
          text: '삭제',
          onPress: () => {
            onDelete();
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
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
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{flex: 2}} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          {isUpdateMode ? (
            // 수정 버튼을 눌렀을 때
            <ImageBackground
              style={styles.bgImage}
              imageStyle={{opacity: 0.4}}
              source={imgOnModify(diary)}>
              <View style={styles.createFormContainer}>
                {/* 취소 / 완료 버튼 */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={toggleUpdateMode}>
                    <Text style={styles.cancelFont}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.writeButton}
                    onPress={updateDiary}>
                    <Text style={styles.writeFont}>완료</Text>
                  </TouchableOpacity>
                </View>
                {/* 날짜와 감정 */}
                <View style={styles.dayEmotionContainerU}>
                  {/* 날짜 */}
                  <View style={styles.dayContainerU}>
                    <View>
                      <Text style={styles.dayFont}>
                        {new Date(diary.createdAt).getDate()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.dayUnitFont}>일</Text>
                    </View>
                  </View>
                  {/* 감정 */}
                  <View style={styles.emotionContainerU}>
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
                {/* 제목 및 내용 수정 */}
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
                <TouchableOpacity onPress={deleteDiary}>
                  <Text>삭제</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ) : (
            // 상세 페이지인 경우 //

            <ImageBackground
              style={styles.bgImage}
              imageStyle={{opacity: 0.4}}
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
                  <TouchableOpacity
                    style={styles.writeButton}
                    onPress={toggleUpdateMode}>
                    <Text style={styles.writeFont}>편집</Text>
                  </TouchableOpacity>
                </View>
                {/* 날짜와 작성자 감정상태 */}
                <View style={styles.dayEmotionContainer}>
                  <View style={{flex: 1}}></View>
                  <View style={styles.dayContainer}>
                    <View>
                      <Text style={styles.dayFont}>
                        {formatDiaryDay(diary.createdAt)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.dayUnitFont}>일</Text>
                    </View>
                  </View>
                  <View style={styles.emotionContainer}>
                    {/* 닉네임 */}
                    <View>
                      <Text style={styles.authorFont}>{diary.name}</Text>
                    </View>
                    {/* 감정 이모티콘 */}
                    <View>
                      <Image
                        style={{width: 24, height: 24}}
                        source={selectedEmotionUrl(selectedEmotion)}
                      />
                    </View>
                  </View>
                </View>
                <View>
                  {/* 제목 및 내용 */}
                  <View style={styles.contentContainer}>
                    <View style={styles.diaryTitleContainer}>
                      <Text style={styles.diaryTitleFont}>{diary.title}</Text>
                    </View>
                    <ScrollView style={{marginTop: 15}}>
                      <Text style={styles.diaryContentFont}>
                        {diary.content}
                      </Text>
                    </ScrollView>
                  </View>
                  {/* 댓글 */}
                  <View style={styles.commentContainer}>
                    <View style={styles.commentSubtitle}>
                      <Text
                        style={{fontSize: 20, fontFamily: 'Pretendard-Black'}}>
                        댓글
                      </Text>
                    </View>
                    {/* 댓글 리스트 */}
                    <View style={styles.commentList}>
                      <ScrollView nestedScrollEnabled={true}>
                        <View onStartShouldSetResponder={() => true}>
                          {diary?.diaryComments?.map(comment => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                                key={comment.commentId}>
                                <View>
                                  <Text style={{fontSize: 13}}>
                                    {comment.name}: {comment.content}
                                  </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                  {/* <TouchableOpacity>
                                    <Text>수정</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity>
                                    <Text>삭제</Text>
                                  </TouchableOpacity> */}
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                    {/* 댓글 입력폼 */}
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <TextInput
                        style={{
                          borderBottomWidth: 1,
                          borderColor: 'gray',
                          width: '90%',
                          height: 35,
                        }}
                        onChangeText={text => {
                          setDiaryComment(text);
                        }}
                        value={diaryComment}
                      />
                      <TouchableOpacity onPress={writeComment}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          )}
        </Animated.View>
        <TouchableWithoutFeedback onPress={closeModal}>
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
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // borderWidth: 1,
    // borderColor: 'black',

    marginTop: 10,
  },
  dayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',

    height: 60,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  authorFont: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },
  emotionIcon: {
    width: 28,
    height: 28,
  },
  blurEmotionIcon: {
    opacity: 0.5,
  },
  contentContainer: {
    height: 200,
    marginTop: 20,
    padding: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  diaryTitleContainer: {
    marginBottom: 20,
  },
  diaryContentContainer: {},
  diaryTitleFont: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
  },
  diaryContentFont: {
    fontSize: 15,
    lineHeight: 23,
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
  commentContainer: {
    height: 130,
    marginTop: 10,
    padding: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  commentList: {
    maxHeight: 50,
    marginTop: 8,
  },
  commentContent: {
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 15,
    height: 25,
    marginRight: 10,
  },
  // 일기 수정 관련
  dayEmotionContainerU: {},
  dayContainerU: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  emotionContainerU: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
