import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DiaryList from '../../components/diary/DiaryList';
import DiaryCreate from '../../components/diary/DiaryCreate';
import DatePicker from 'react-native-modern-datepicker';
import axiosInstance from '../../util/Interceptor';

export default function DiaryScreen() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 초기 년도 설정
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 초기 월 설정 (0은 1월을 의미)
  const [diarys, setDiarys] = useState([]);

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

  // 일기 등록 모달 설정
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const onModal = () => {
    setCreateModalVisible(true);
  };

  const getDiaryData = () => {
    axiosInstance
      .get(`/calendar/month`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      .then(res => {
        const diaryArray = res.data.data.calendarMonthDiaryResponseDtos;
        setDiarys(diaryArray);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDiaryData();
  }, [selectedYear, selectedMonth]);

  return (
    <View style={styles.container}>
      {/* 연월 선택 */}
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
      {/* 연월 선택 모달 */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.pickerContainer}>
          <DatePicker
            mode="monthYear"
            selectorStartingYear={2020}
            onMonthYearChange={selectedDate => {
              const [year, month] = selectedDate.split(' ');
              handleDatePickerChange(year, month);
            }}
          />
        </View>
      </Modal>
      {/* 일기 추가 버튼 */}
      <TouchableOpacity style={styles.addBtnContainer} onPress={onModal}>
        <Ionicons name="add-outline" size={24} color="black" />
      </TouchableOpacity>
      {/* 일기 리스트 */}
      <DiaryList diarys={diarys} />
      <DiaryCreate
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
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
  diaryList: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 400,
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
