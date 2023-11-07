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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../util/Interceptor';
import axiosFileInstance from '../util/FileInterceptor';
import { launchImageLibrary } from 'react-native-image-picker';

export default function MypageScreen({route}) {
  const [family, setFamily] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [image, setImage] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [isNickNameEditMode, setIsNickNameEditMode] = useState(false); // 유저 닉네임 편집 모드 상태
  const [backgroundImageUri, setBackgroundImageUri] = useState(null);
  const [modifiedNickName, setModifiedNickName] = useState([]);
  const [modifiedFamilyContent, setModifiedFamilyContent] = useState([]);

  const outside = useRef();

  const [nickname, setNickname] = useState([]);

  const [memberUpdated, setMemberUpdated] = useState(false);
  const [familyUpdated, setFamilyUpdated] = useState(false);

  const [memberProfileImgUrl, setMemberProfileImgUrl] = useState();
  const [basicImg, setBasicImg] = useState();

  // 이미지 변경 모달창 관련 변수
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;

  const selectImage = async BackgroudOrProfile =>  {
    console.log('변경할 요소 : ', BackgroudOrProfile);

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
        const uri = response.assets[0].uri ;

        console.log(uri);

        return _uploadImage(uri, BackgroudOrProfile);
      }
    });
  };

  // 모달창 출력 함수
  const showButtons = () => {
    setModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 모달창 가리기 함수
  const hideButtons = () => {
    console.log('모달창 가리기');
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
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

    console.log('수정할 이미지 : ', image);
    if (BackgroudOrProfile == 'Background') {
      setBackgroundImageUri(uri);
    } else {
      setMemberProfileImgUrl(uri);
    }
  };

  // 가족은 배경사진만 변경되는 것
  const modifyFamily = async () => {
    console.log('modifyFamily 함수 시작!');

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

    await axiosFileInstance
      .post('/family/modify', formData)
      .then(response => {
        console.log(response.data);
        console.log('수정된 가족의 ID : ', response.data.data.familyId);
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

    await axiosFileInstance
      .put(`/members/profile`, formData2)
      .then(response => {
        console.log('수정 응답 데이터 : ', response.data);
        setMemberUpdated(true); // 성공적으로 가족 정보가 수정되었다는 표시
      })
      .catch(error => {
        console.error('회원 프로필 사진 수정 에러: ', error);
      });
  };

  useEffect(() => {
    async function fetchData() {
      const familyId = await AsyncStorage.getItem('familyId');

      console.log('선택한 가족 ID : ', familyId);

      axiosInstance
        .get(`/family/choice?familyId=${familyId}`)
        .then(response => {
          console.log('가족 정보 : ', response.data.data);
          setFamily(response.data.data);

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

		axiosInstance.get(`/family/mypage?familyId=${familyId}`).then((response) => {
			console.log('본인 닉네임 : ', response.data.data);
			setNickname(response.data.data.nickname);
		})
		
    }

    fetchData();

    // 데이터 가져오기 작업이 끝난 후 familyUpdated를 다시 false로 설정
    if (familyUpdated) {
      setFamilyUpdated(false);
    }

    if (memberUpdated) {
      setMemberUpdated(false);
    }
  }, [familyUpdated, memberUpdated]);

  return (
    <ImageBackground
      source={{uri: backgroundImageUri}}
      style={styles.container}
      resizeMode="cover">
      <View style={styles.header}>
        {isEditMode ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setBasicImg('Background');
                showButtons();
              }}>
              <Image source={require('../assets/camera.png')} style={{}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                modifyFamily();
                setIsEditMode(false);
                setIsNickNameEditMode(false);
              }}>
              <Text style={{color: 'white', fontSize: 20}}>완료</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsEditMode(true);
            }}>
            <Image
              source={require('../assets/geer.png')}
              style={styles.editButton}
            />
          </TouchableOpacity>
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
        {isEditMode && isNickNameEditMode ? (
          <TextInput
            style={familyStyles.familyName}
            defaultValue={nickname}
            editable={isNickNameEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
            onChangeText={text => {
				setModifiedNickName(text);
            }}
            autoFocus={isNickNameEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
          />
        ) : (
          <Text style={familyStyles.familyName}>{nickname}</Text>
        )}

        {isEditMode && (
          <TouchableOpacity
            style={[
              familyStyles.editButtonFamilyText,
              {position: 'absolute', right: 0, paddingTop: 5},
            ]}
            onPress={() => setIsNickNameEditMode(true)}>
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
            <Image source={require('../assets/camera.png')} style={{}} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={hideButtons}>
        <TouchableWithoutFeedback onPress={hideButtons}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContainer, {transform: [{translateY}]}]}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    selectImage(
                      basicImg == 'Background' ? 'Background' : 'Profile',
                    )
                  }>
                  <Text>앨범에서 사진 선택하기</Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: 'gray',
                    height: 1,
                    paddingHorizontal: '100%',
                  }}
                />
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => handleBasicImg()}>
                  <Text>기본 이미지로 변경하기</Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: 'gray',
                    height: 1,
                    paddingHorizontal: '100%',
                  }}
                />
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={hideButtons}>
                  <Text>취소</Text>
                </TouchableOpacity>
              </View>
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
    // justifyContent: 'center',
    backgroundColor: 'gray',
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
    width: 80, // 원하는 이미지 크기로 조정
    height: 80, // 원하는 이미지 크기로 조정
    marginTop: 20,
    borderRadius: 25, // 원형 이미지를 위해
  },
  userImage: {
    width: 20,
    height: 20,
    marginRight: 30, // 간격을 15로 조절했습니다.
    borderRadius: 30,
  },
  whiteText: {
    fontSize: 20,
    color: 'white',
    marginRight: 30, // 간격을 15로 조절했습니다.
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'white',
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
    flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
    fontSize: 16,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
});

const memberStyles = StyleSheet.create({
  memberContainer: {
    position: 'relative',
    width: 100, // 원하는 이미지 크기로 조정하세요.
    height: 100, // 원하는 이미지 크기로 조정하세요.
  },
  memberImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60, // 원하는 border radius 값을 조정하세요.
  },
  button: {
    position: 'absolute',
    marginTop: 80,
    marginStart: 70,
  },
});
