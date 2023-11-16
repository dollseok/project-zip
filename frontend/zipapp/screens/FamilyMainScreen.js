import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../util/Interceptor';
import axiosFileInstance from '../util/FileInterceptor';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {validateText} from '../components/check/ValidateText';
import {lengthText} from '../components/check/LengthText';
import DiaryItem from '../components/diary/DiaryItem';

export default function FamilyMainScreen({navigation}) {
  const [family, setFamily] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [image, setImage] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [isFamilyNameEditMode, setIsFamilyNameEditMode] = useState(false); // 가족 이름 편집 모드 상태
  const [isFamilyContentEditMode, setIsFamilyContentEditMode] = useState(false); // 가족 이름 편집 모드 상태
  const [backgroundImageUri, setBackgroundImageUri] = useState(null);
  const [modifiedFamilyName, setModifiedFamilyName] = useState([]);
  const [modifiedFamilyContent, setModifiedFamilyContent] = useState([]);
  const [isModifyFamilyComplete, setIsModifyFamilyComplete] = useState(false);

  const outside = useRef();

  const [member, setMember] = useState([]);

  const [memberUpdated, setMemberUpdated] = useState(false);
  const [familyUpdated, setFamilyUpdated] = useState(false);

  const [memberProfileImgUrl, setMemberProfileImgUrl] = useState();
  const [basicImg, setBasicImg] = useState();

  // 이미지 변경 모달창 관련 변수
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const translateY = useRef(new Animated.Value(300)).current;

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

        return _uploadImage(uri, BackgroudOrProfile);
      }
    });
  };

  // 모달창 출력 함수
  const showButtons = () => {
    setImageModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 모달창 가리기 함수
  const hideButtons = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setImageModalVisible(false);
    });
  };

  const handleBasicImg = async () => {
    if (basicImg == 'Profile') {
      setMemberProfileImgUrl(
        'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/member/user.png',
      );
    } else {
      setBackgroundImageUri(
        'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/diary/gray.png',
      );
    }
  };

  const _uploadImage = async (uri, BackgroudOrProfile) => {
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    setImage({
      uri: uri,
      name: `photo.jpeg`,
      type: `image/jpeg`,
    });

    if (BackgroudOrProfile == 'Background') {
      setBackgroundImageUri(uri);
    } else {
      setMemberProfileImgUrl(uri);
    }
  };

  const modifyFamily = async () => {
    // 변경하고자 하는 가족 이름과, 가족 메시지가 적합한 상태인지 체크
    if (
      (await validateText(modifiedFamilyName)) == false ||
      (await validateText(modifiedFamilyContent)) == false
    ) {
      return false;
    }

    if (
      (await lengthText(modifiedFamilyName, 'FamilyName')) == false ||
      (await lengthText(modifiedFamilyContent, 'FamilyContent')) == false
    ) {
      return false;
    }

    const formData = new FormData();

    const familyModifyRequest = {
      id: family.familyId,
      name: modifiedFamilyName,
      content: modifiedFamilyContent,
    };

    formData.append('familyModifyRequest', JSON.stringify(familyModifyRequest));

    formData.append('file', {
      uri: backgroundImageUri,
      name: `photo.jpeg`,
      type: `image/jpeg`,
    });

    axiosFileInstance
      .post('/family/modify', formData)
      .then(response => {
        AsyncStorage.setItem(
          'familyId',
          JSON.stringify(response.data.data.familyId),
        );
        setFamilyUpdated(true); // 성공적으로 가족 정보가 수정되었다는 표시
      })
      .catch(error => {
        console.error('가족 등록 에러: ', error);
      });

    const formData2 = new FormData();

    formData2.append('file', {
      uri: memberProfileImgUrl,
      name: `photo.jpeg`,
      type: `image/jpeg`,
    });

    axiosFileInstance
      .put(`/members/profile`, formData2)
      .then(response => {
        setMemberUpdated(true); // 성공적으로 가족 정보가 수정되었다는 표시
      })
      .catch(error => {
        console.error('회원 프로필 사진 수정 에러: ', error);
      });

    setIsEditMode(false);
    setIsFamilyNameEditMode(false);
    setIsFamilyContentEditMode(false);

    // 다시 useEffect 호출해야됨
    setIsModifyFamilyComplete(true);
  };

  // 클릭된 일기 상세 정보 표시 및 네비게이션 설정
  const handleDiaryClick = diary => {
    // DiaryItem.js로 넘어가기
    console.log('선택한 일기 : ', diary);
    // createdAt 값을 Date 객체로 변환
    // const createdAtDate = new Date(diary.createdAt);

    // 년도와 월 추출
    // const selectedYear = createdAtDate.getFullYear();
    // const selectedMonth = createdAtDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.

    navigation.navigate('일기', {
      dateInfo: diary.createdAt,
    });
  };

  const fetchData = async () => {
    const familyId = await AsyncStorage.getItem('familyId');
    // const familyId = 139;
    await axiosInstance
      .get(`/family/choice?familyId=${familyId}`)
      .then(response => {
        setFamily(response.data.data);
        setModifiedFamilyName(response.data.data.familyName);
        setModifiedFamilyContent(response.data.data.familyContent);

        if (response.data.data.memberProfileImgUrl == null) {
          setMemberProfileImgUrl(
            'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/member/user.png',
          );
        } else {
          setMemberProfileImgUrl(response.data.data.memberProfileImgUrl);
        }

        if (response.data.data.familyProfileImgUrl == null) {
          setBackgroundImageUri(
            'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/diary/gray.png',
          );
        } else {
          setBackgroundImageUri(response.data.data.familyProfileImgUrl);
        }
      });

    await axiosInstance
      .get(`/schedule/list?familyId=${familyId}`)
      .then(response => {
        // console.log(response);
        setSchedules(response.data.data.scheduleListDetailResponseList);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    await axiosInstance
      .get(`/diary/list?familyId=${familyId}`)
      .then(response => {
        // console.log(response);
        setDiaries(response.data.data.diaryListDetailResponseList);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    // 데이터 가져오기 작업이 끝난 후 familyUpdated를 다시 false로 설정
    if (familyUpdated) {
      setFamilyUpdated(false);
    }

    if (memberUpdated) {
      setMemberUpdated(false);
    }
  };

  useEffect(() => {
    if (isModifyFamilyComplete) {
      fetchData();
      setIsModifyFamilyComplete(false);
    }
  }, [isModifyFamilyComplete]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground
      source={{uri: backgroundImageUri}}
      style={styles.container}
      // resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.header}>
        {isEditMode ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setIsEditMode(false);
                setIsFamilyNameEditMode(false);
                setIsFamilyContentEditMode(false);
                setIsModifyFamilyComplete(true);
              }}>
              <Text style={{color: 'white', fontSize: 20}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBasicImg('Background');
                showButtons();
              }}>
              <Ionicons name="camera-outline" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                modifyFamily();
              }}>
              <Text style={{color: 'white', fontSize: 20}}>완료</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                setIsEditMode(true);
              }}>
              <Ionicons name="settings-outline" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('가족선택');
              }}>
              <Ionicons name="list" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View
        style={[
          {flexDirection: 'row', alignItems: 'center'},
          isEditMode
            ? {
                borderBottomWidth: 1,
                borderBottomColor: 'white',
                marginHorizontal: 60,
              }
            : {borderBottomWidth: 0},
        ]}>
        {isEditMode && isFamilyNameEditMode ? (
          <TextInput
            style={familyStyles.familyName}
            defaultValue={family.familyName}
            editable={isFamilyNameEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
            onChangeText={text => {
              setModifiedFamilyName(text);
            }}
            autoFocus={isFamilyNameEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
          />
        ) : (
          <Text style={familyStyles.familyName}>{family.familyName}</Text>
        )}

        {isEditMode && (
          <TouchableOpacity
            style={[
              familyStyles.editButtonFamilyText,
              {position: 'absolute', right: 0, paddingTop: 5},
            ]}
            onPress={() => setIsFamilyNameEditMode(true)}>
            <Image
              source={require('../assets/pencil.png')}
              style={styles.editButtonIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          {flexDirection: 'row', alignItems: 'center', marginTop: 5},
          isEditMode
            ? {
                borderBottomWidth: 1,
                borderBottomColor: 'white',
                marginHorizontal: 60,
              }
            : {borderBottomWidth: 0},
        ]}>
        {isEditMode && isFamilyContentEditMode ? (
          <TextInput
            style={familyStyles.familyContent}
            defaultValue={family.familyContent}
            editable={isFamilyContentEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
            onChangeText={text => {
              setModifiedFamilyContent(text);
            }}
            autoFocus={isFamilyContentEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
          />
        ) : (
          <Text style={familyStyles.familyContent}>{family.familyContent}</Text>
        )}

        {isEditMode && (
          <TouchableOpacity
            style={[
              familyStyles.editButtonFamilyText,
              {position: 'absolute', right: 0},
            ]}
            onPress={() => setIsFamilyContentEditMode(true)}>
            <Image
              source={require('../assets/pencil.png')}
              style={styles.editButtonIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <Image source={{uri: memberProfileImgUrl}} style={styles.memberImage} />
        {isEditMode && (
          <TouchableOpacity
            onPress={() => {
              setBasicImg('Profile');
              showButtons();
            }}
            style={memberStyles.button}>
            <Ionicons name="camera-outline" size={25} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.headingSchedule}>일정</Text>
      <FlatList
        data={schedules.slice(0, 2)}
        renderItem={({item}) => (
          <View style={styles.scheduleItem}>
            <Image
              source={{
                uri:
                  item.profileImgUrl == null
                    ? 'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/member/user.png'
                    : item.profileImgUrl,
              }}
              style={styles.userImage}
            />
            <Text style={styles.whiteText}>{item.nickname}</Text>
            <Text style={styles.whiteText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item.scheduleId.toString()}
      />
      {/* 일기 리스트 출력 */}
      <Text style={styles.headingDiary}>일기</Text>
      <FlatList
        data={diaries.slice(0, 2)}
        renderItem={({item}) => (
          <View style={styles.diaryItem}>
            <Image
              source={{
                uri:
                  item.profileImgUrl == null
                    ? 'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/member/user.png'
                    : item.profileImgUrl,
              }}
              style={styles.userImage}
            />
            <Text style={styles.whiteText}>{item.nickname}</Text>
            <Text style={styles.whiteText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.diaryId.toString()}
      />
      {/* <ScrollView>
        {diaries.map(diary => {
          return (
            <View style={styles.diaryItem}>
              <DiaryItem
                diarySummary={diary}
                key={diary.diaryId}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}></DiaryItem>
            </View>
          );
        })}
      </ScrollView> */}
      {/* 공간 */}
      <View>
        <Text style={[{marginVertical: 30}]}></Text>
      </View>
      <Modal
        transparent={true}
        animationType="none"
        visible={imageModalVisible}
        onRequestClose={hideButtons}>
        <TouchableWithoutFeedback onPress={hideButtons}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContainer, {transform: [{translateY}]}]}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    marginHorizontal: 10,
                    paddingHorizontal: 98,
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                  }}>
                  <Text style={{fontWeight: 'bold', color: 'gray'}}>
                    {basicImg === 'Background'
                      ? '배경 사진 변경하기'
                      : '프로필 사진 변경하기'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    marginHorizontal: 10,
                    paddingHorizontal: 98,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                  }}
                  onPress={() =>
                    selectImage(
                      basicImg == 'Background' ? 'Background' : 'Profile',
                    )
                  }>
                  <Text style={{fontWeight: 'bold'}}>
                    앨범에서 사진 선택하기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    paddingHorizontal: 98,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                  onPress={() => handleBasicImg()}>
                  <Text style={{fontWeight: 'bold'}}>
                    기본 이미지로 변경하기
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 0.3,
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  margin: 10,
                  paddingHorizontal: 150,
                  borderRadius: 20,
                }}
                onPress={hideButtons}>
                <Text style={{fontWeight: 'bold'}}>취소</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.6,
    // backgroundColor: 'gray',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 컴포넌트를 부모의 전체 영역에 맞춤
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 검은색 배경에 반투명도 50%
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // 이 부분 변경
    paddingHorizontal: 20,
    paddingTop: 30,
    marginTop: 10,
  },
  editButton: {
    width: 30,
    height: 30,
  },
  memberImage: {
    width: 80,
    height: 80,
    marginTop: 20,
    borderRadius: 25,
  },
  headingSchedule: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 30,
    marginBottom: 10,
  },
  headingDiary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 7,
    marginVertical: 5,
    width: 300,
    height: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    // borderColor: 'white',
  },
  whiteText: {
    fontSize: 20,
    color: 'white',
    marginRight: 30,
  },
  diaryItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 7,
    marginVertical: 5,
    width: 300,
    height: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    // borderColor: 'white',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    // backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    marginRight: 30,
    borderRadius: 10,
  },
});

const familyStyles = StyleSheet.create({
  familyName: {
    flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
  },

  editButtonFamilyText: {
    width: 20,
    height: 20,
    // marginRight: 30,
  },

  familyContent: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
});

const memberStyles = StyleSheet.create({
  memberContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  memberImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50, // 원하는 border radius 값을 조정하세요.
  },
  button: {
    position: 'absolute',
    marginTop: 80,
    marginStart: 70,
  },
});
