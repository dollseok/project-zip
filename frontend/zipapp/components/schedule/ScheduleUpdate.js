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
  Alert,
} from 'react-native';
import {format} from 'date-fns';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../util/Interceptor';

export default function ScheduleUpdate(props) {
  const {schedule, scheduleId} = props;
  // 일정 수정에 필요한 데이터
  // 수정할 일정 id
  // 가족 id
  const [scheduleTitle, setScheduleTitle] = useState(schedule.name); // 제목
  const [startDate, setStartDate] = useState(new Date()); // 시작일
  const [endDate, setEndDate] = useState(new Date()); // 종료일

  // 일정 수정
  const updateSchedule = async () => {
    const familyId = await AsyncStorage.getItem('familyId');
    const scheduleStart = format(new Date(startDate), 'yyyy-MM-dd');
    const scheduleEnd = format(new Date(endDate), 'yyyy-MM-dd');
    console.log('수정할 일정 Id: ', scheduleId);
    console.log('가족 Id: ', familyId);
    console.log('수정할 일정 제목: ', scheduleTitle);
    console.log('일정 시작일: ', scheduleStart);
    console.log('일정 종료일: ', scheduleEnd);

    axiosInstance
      .put(`/schedule/modify`, {
        scheduleId: scheduleId,
        familyId: familyId,
        scheduleTitle: scheduleTitle,
        startDate: scheduleStart,
        endDate: scheduleEnd,
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // 일정 삭제
  const deleteSchedule = async () => {
    const familyId = await AsyncStorage.getItem('familyId');
    // console.log('삭제할 일정 id:', schedule.scheduleId);
    // console.log('일정삭제 가족 id:', familyId);

    const scheduleDeleteRequestDto = {
      scheduleId: scheduleId,
      familyId: familyId,
    };

    axiosInstance
      .delete(`/schedule/delete`, {data: scheduleDeleteRequestDto})
      .then(res => {
        console.log(res.data.msg);
        if (res.data.msg === '일정 삭제 성공') {
          Alert.alert('', '일정이 삭제되었습니다.', [
            {
              text: '확인',
              onPress: () => setUpdateModalVisible(false),
            },
          ]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // 시작일 종료일 모달 오픈 여부
  const [openPickStart, setOpenPickStart] = useState(false); // 시작일 모달 보여줄지 여부
  const [openPickEnd, setOpenPickEnd] = useState(false); // 종료일 모달 보여줄지 여부

  // 일정 등록창 모달 설정
  const {updateModalVisible, setUpdateModalVisible} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetScheduleUpdate = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeScheduleUpdate = Animated.timing(panY, {
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
          resetScheduleUpdate.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.updateModalVisible) {
      resetScheduleUpdate.start();
    } else {
      closeScheduleUpdate.start();
    }
  }, [props.updateModalVisible]);

  const closeModal = () => {
    closeScheduleUpdate.start(() => {
      setUpdateModalVisible(false);
    });
  };

  return (
    <Modal
      visible={updateModalVisible}
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
                onPress={updateSchedule}>
                <Text>완료</Text>
              </TouchableOpacity>
            </View>
            {/* 일정 이름 입력 */}
            <View style={styles.contentContainer}>
              <TextInput
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
            <TouchableOpacity onPress={deleteSchedule}>
              <Text>삭제</Text>
            </TouchableOpacity>
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
