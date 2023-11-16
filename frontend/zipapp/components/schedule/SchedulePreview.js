import {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import axiosInstance from '../../util/Interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SchedulePreview(props) {
  const {modalVisible, setModalVisible, selectedDate, navigation} = props;
  // console.log('캘린더에서 선택한 날짜: ', selectedDate);
  // 선택한 날의 일정 정보
  const [todaySchedule, setTodaySchedule] = useState([]);

  const getTodaySchedule = async today => {
    const familyId = await AsyncStorage.getItem('familyId');
    // console.log('조회할 날짜: ', selectedDate);
    // console.log('가족 id: ', familyId);
    axiosInstance
      .get(`/calendar/day`, {
        params: {
          todayDate: today,
          familyId: familyId,
        },
      })
      .then(res => {
        // console.log(
        //   '선택한 날의 일정 정보',
        //   res.data.data.calendarDayScheduleResponseDtoList,
        // );
        // console.log('선택한 날의 일정 및 일기 정보', res.data.data);
        const todayScheduleInfo =
          res.data.data.calendarDayScheduleResponseDtoList;
        setTodaySchedule(todayScheduleInfo);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (modalVisible) {
      getTodaySchedule(selectedDate);
    }
  }, [modalVisible]);

  // 모달 관련 설정 //
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetSchedulePreview = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeSchedulePreview = Animated.timing(panY, {
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
          resetSchedulePreview.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetSchedulePreview.start();
    } else {
      closeSchedulePreview.start();
    }
  }, [props.modalVisible]);

  const closeModal = () => {
    closeSchedulePreview.start(() => {
      setModalVisible(false);
    });
  };

  ////

  return (
    <Modal
      visible={modalVisible}
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
          {/* 일정 화면으로 이동할 버튼 */}
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                navigation.navigate('일정', {
                  dateInfo: selectedDate,
                });
              }}>
              <Text style={{color: '#727272'}}>자세히 보기 </Text>
              <Ionicons name="arrow-forward" size={18} color="#727272" />
            </TouchableOpacity>
          </View>
          {/* 일정 미리보기  */}
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewDateFont}>
                {selectedDate.split('-')[2]}
              </Text>
            </View>
            <View>
              <Text style={styles.dateUnitFont}>일</Text>
            </View>
          </View>
          <View style={styles.previewContent}>
            <View>
              {todaySchedule.length > 0 ? (
                <View>
                  <View style={{marginBottom: 5}}>
                    <Text style={styles.contentTitleFont}>일정 </Text>
                  </View>
                  <FlatList
                    style={{maxHeight: 50}}
                    data={todaySchedule}
                    renderItem={({item}) => (
                      <View
                        style={{flexDirection: 'row', marginVertical: 1}}
                        key={item.scheduleId}>
                        <Entypo name="dot-single" size={24} color="black" />
                        <Text>{item.title}</Text>
                      </View>
                    )}
                  />
                </View>
              ) : (
                <Text style={styles.contentTitleFont}>일정 없음</Text>
              )}
            </View>
          </View>
        </Animated.View>
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
    height: 300,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    // alignItems: 'baseline',
  },
  // 일정 날짜 텍스트
  previewDateFont: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 50,
  },
  // 날짜 단위 텍스트
  dateUnitFont: {
    paddingTop: 18,
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentTitleFont: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  previewContent: {
    marginTop: 11,
  },
});
