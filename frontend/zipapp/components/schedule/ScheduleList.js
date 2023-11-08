import {StyleSheet, View, Text, ScrollView} from 'react-native';
import ScheduleItem from './ScheduleItem';
import axiosInstance from '../../util/Interceptor';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScheduleList(props) {
  const {schedules} = props;
  console.log('일정화면에서 받아온 일정 리스트: ', schedules);
  // const getScheduleList = async () => {
  // 	console.log('연도: ', selectedYear);
  // 	console.log('월: ', selectedMonth);

  // 	axiosInstance
  // 		.get(`/calendar/month`, {
  // 			params: {
  // 				year: selectedYear,
  // 				month: selectedMonth,
  // 			},
  // 		})
  // 		.then((res) => {
  // 			const scheduleArray =
  // 				res.data.data.calendarMonthScheduleResponseDtoList;
  // 			console.log('일정 리스트: ', scheduleArray);
  // 			setSchedules(scheduleArray);
  // 		})
  // 		.catch((err) => {
  // 			if (err.response) {
  // 				// 서버 응답 오류인 경우
  // 				console.log('서버 응답 오류', err.response.status, err.response.data);
  // 			} else {
  // 				// 요청 자체에 문제가 있는 경우
  // 				console.log('요청 오류', err.message);
  // 			}
  // 		});
  // };

  return (
    <View style={styles.scheduleList}>
      {!schedules ? <Text>아직 등록된 일정이 없습니다</Text> : <></>}
      <ScrollView style={{width: '100%'}}>
        {schedules.map(schedule => {
          return (
            <ScheduleItem
              startDate={schedule.startDate}
              scheduleId={schedule.scheduleId}
              key={schedule.scheduleId}></ScheduleItem>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleList: {
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: 'black',
    alignItems: 'center',
    width: '80%',
    height: '60%',
    gap: 10, // 일정별 간격
  },
});
