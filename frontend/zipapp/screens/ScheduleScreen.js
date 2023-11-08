import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';

import ScheduleList from '../components/schedule/ScheduleList';
import ScheduleCreate from '../components/schedule/ScheduleCreate';

import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-modern-datepicker';
import axiosInstance from '../util/Interceptor';

export default function ScheduleScreen({route, navigation}) {
  const [schedules, setSchedules] = useState([]);

  const getScheduleList = async () => {
    axiosInstance
      .get(`/calendar/month`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      .then(res => {
        // 월별 일정 데이터
        const scheduleArray =
          res.data.data.calendarMonthScheduleResponseDtoList;
        setSchedules(scheduleArray);
      })
      .catch(err => {
        if (err.response) {
          // 서버 응답 오류인 경우
          console.log('서버 응답 오류', err.response.status, err.response.data);
        } else {
          // 요청 자체에 문제가 있는 경우
          console.log('요청 오류', err.message);
        }
      });
  };

  // 캘린더에서 받아온 현재 날짜정보
  // 예시) '2023-10-25'
  const {dateInfo} = route.params;
  console.log('일정 미리보기에서 넘어올 때 받아온 날짜정보: ', route.params);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  useEffect(() => {
    if (dateInfo) {
      setSelectedYear(dateInfo.split('-')[0]);
      setSelectedMonth(dateInfo.split('-')[1]);
    }
  }, []);

  useEffect(() => {
    getScheduleList();
  }, [selectedYear, selectedMonth]);

  // 연월 선택창 모달 설정
  const [isModalVisible, setisModalVisible] = useState(false);
  const showPickerModal = () => {
    setisModalVisible(true);
  };
  const hidePickerModal = () => {
    setisModalVisible(false);
  };
  // 연월 선택했을 경우 실행될 함수
  const handleDatePickerChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);

    hidePickerModal();
  };

  // 일정 등록 모달 설정
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const onModal = () => {
    setCreateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {/* 중앙 정렬을 위해 안보이게 처리 */}
        <View style={{paddingLeft: 15, opacity: 0}}>
          <Ionicons name="calendar-outline" size={30} color="black" />
        </View>
        <View style={{opacity: 0}}>
          <Text>월</Text>
        </View>
        {/* 선택된 날짜정보 */}
        <View style={styles.selectDate}>
          <View style={styles.selectYear}>
            <Text style={{fontSize: 24}}>{selectedYear}</Text>
          </View>
          <View style={styles.selectMonth}>
            <Text style={{fontSize: 40}}>{selectedMonth}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'flex-end', paddingBottom: 10}}>
          <Text style={{fontSize: 15}}>월</Text>
        </View>
        {/* 날짜 선택창 여는 버튼 */}
        <View style={styles.selectDateBtn}>
          <TouchableOpacity onPress={showPickerModal}>
            <Ionicons name="calendar-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* 연 월 선택 모달 */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.pickerContainer}>
          <DatePicker
            mode="monthYear"
            selectorStartingYear={2020}
            onMonthYearChange={selectedDate => {
              console.log('일정 화면에서 선택된 연월: ', selectedDate);
              const [year, month] = selectedDate.split(' ');
              handleDatePickerChange(year, month);
            }}
          />
        </View>
      </Modal>
      {/* 일정 추가 버튼 */}
      <TouchableOpacity style={styles.addBtnContainer} onPress={onModal}>
        <Ionicons name="add-outline" size={24} color="black" />
      </TouchableOpacity>
      {/* 일정 리스트 */}
      <ScheduleList schedules={schedules} key={schedules} />
      <ScheduleCreate
        createModalVisible={createModalVisible}
        setCreateModalVisible={setCreateModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  selectDate: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
  },
  selectDateBtn: {
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnContainer: {
    width: '80%',
    alignItems: 'flex-end',
  },
});
