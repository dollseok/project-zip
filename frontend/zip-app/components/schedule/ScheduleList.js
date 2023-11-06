import { StyleSheet, View, Text } from 'react-native';
import ScheduleItem from './ScheduleItem';
import axiosInstance from '../../util/Interceptor';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScheduleList() {
	const [schedules, setSchedules] = useState([]);

	const getScheduleList = async () => {
		const familyId = await AsyncStorage.getItem('familyId');
		console.log('가족 ID: ', familyId);

		axiosInstance
			.get(`/schedule/list`, {
				params: {
					familyId: familyId,
				},
			})
			.then((res) => {
				const scheduleArray = res.data.data.scheduleListDetailResponseList;
				console.log('일정 리스트: ', scheduleArray);
				setSchedules(scheduleArray);
			})
			.catch((err) => {
				if (err.response) {
					// 서버 응답 오류인 경우
					console.log('서버 응답 오류', err.response.status, err.response.data);
				} else {
					// 요청 자체에 문제가 있는 경우
					console.log('요청 오류', err.message);
				}
			});
	};

	useEffect(() => {
		getScheduleList();
	}, []);

	return (
		<View style={styles.scheduleList}>
			{!schedules ? <Text>아직 등록된 일정이 없습니다</Text> : <></>}
			{schedules.map((schedule) => {
				return (
					<ScheduleItem
						schedule={schedule}
						key={schedule.scheduleId}
					></ScheduleItem>
				);
			})}
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
