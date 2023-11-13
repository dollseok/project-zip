import {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import {format} from 'date-fns';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../util/Interceptor';
import {response} from 'express';
import * as Notification from '../notification/Notification';

export default function ScheduleCreate(props) {
  // 일정 등록에 필요한 데이터
  const [scheduleTitle, setScheduleTitle] = useState(''); // 제목
  const [startDate, setStartDate] = useState(new Date()); // 시작일
  const [endDate, setEndDate] = useState(new Date()); // 종료일

  // 일정 등록
  const createSchedule = async () => {
    const familyId = await AsyncStorage.getItem('familyId');
    const scheduleStart = format(new Date(startDate), 'yyyy-MM-dd');
    const scheduleEnd = format(new Date(endDate), 'yyyy-MM-dd');
    console.log('가족 Id: ', familyId);
    console.log('일정 제목: ', scheduleTitle);
    console.log('일정 시작일: ', format(new Date(startDate), 'yyyy-MM-dd'));
    console.log('일정 종료일: ', format(new Date(endDate), 'yyyy-MM-dd'));

    axiosInstance
      .post(`/schedule/register`, {
        familyId: familyId,
        title: scheduleTitle,
        startDate: scheduleStart,
        endDate: scheduleEnd,
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });

	  Notification.sendNotification('새로운 일정이 등록되었습니다.');
  };

  // 시작일 종료일 모달 오픈 여부
  const [openPickStart, setOpenPickStart] = useState(false); // 시작일 모달 보여줄지 여부
  const [openPickEnd, setOpenPickEnd] = useState(false); // 종료일 모달 보여줄지 여부

  // 일정 등록창 모달 설정
  const {createModalVisible, setCreateModalVisible} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetScheduleCreate = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeScheduleCreate = Animated.timing(panY, {
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
          resetScheduleCreate.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.createModalVisible) {
      resetScheduleCreate.start();
    } else {
      closeScheduleCreate.start();
    }
  }, [props.createModalVisible]);

  const closeModal = () => {
    closeScheduleCreate.start(() => {
      setCreateModalVisible(false);
    });
  };

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
          <View style={styles.createFormContainer}>
            {/* 취소 & 등록 버튼 */}
            <View style={styles.buttonContainer}>
              {/* 취소 버튼 */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text>취소</Text>
              </TouchableOpacity>
              {/* 등록 버튼 */}
              <TouchableOpacity
                style={styles.writeButton}
                onPress={createSchedule}>
                <Text>완료</Text>
              </TouchableOpacity>
            </View>
            {/* 일정 이름 입력 */}
            <View style={styles.contentContainer}>
              <TextInput
                placeholder="제목"
                style={styles.titleInput}
                onChangeText={text => {
                  setScheduleTitle(text);
                }}
                value={scheduleTitle}
              />
            </View>
            {/* 일정 시작/종료 일자 선택 */}
            <View style={styles.selectDateContainer}>
              <View style={styles.selectDate}>
                <Text style={styles.selectDateLabel}>시작일</Text>
                <TouchableOpacity
                  style={styles.selectDateInput}
                  onPress={() => setOpenPickStart(true)}>
                  <Text>{format(new Date(startDate), 'yyyy.M.d')}</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  androidVariant="iosClone"
                  mode="date"
                  locale="ko-KR"
                  title={null}
                  confirmText="선택"
                  cancelText="취소"
                  open={openPickStart}
                  date={startDate}
                  onConfirm={date => {
                    setOpenPickStart(false);
                    setStartDate(date);
                  }}
                  onCancel={() => {
                    setOpenPickStart(false);
                  }}
                />
              </View>
              <View style={styles.selectDate}>
                <Text style={styles.selectDateLabel}>종료일</Text>
                <TouchableOpacity
                  style={styles.selectDateInput}
                  onPress={() => setOpenPickEnd(true)}>
                  <Text>{format(new Date(endDate), 'yyyy.M.d')}</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  androidVariant="iosClone"
                  mode="date"
                  locale="ko-KR"
                  title={null}
                  cancelText="취소"
                  confirmText="선택"
                  open={openPickEnd}
                  date={endDate}
                  onConfirm={date => {
                    setOpenPickEnd(false);
                    setEndDate(date);
                  }}
                  onCancel={() => {
                    setOpenPickEnd(false);
                  }}
                />
              </View>
            </View>
          </View>
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
  titleInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,

    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  selectDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectDateInput: {
    borderWidth: 1,
    borderColor: 'black',
  },
});
