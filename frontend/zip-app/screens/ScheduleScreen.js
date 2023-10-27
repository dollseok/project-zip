import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

import ScheduleList from '../components/schedule/ScheduleList';

import { AntDesign } from '@expo/vector-icons';

export default function ScheduleScreen({ route, navigation }) {
	// 캘린더에서 받아온 현재 날짜정보
	// 예시) '2023-10-25'
	const { dateInfo } = route.params;

	const [currentYear, setCurrentYear] = useState();
	const [currentMonth, setCurrentMonth] = useState();

	useEffect(() => {
		setCurrentYear(dateInfo.split('-')[0]);
		setCurrentMonth(dateInfo.split('-')[1]);
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.dateContainer}>
				{/* 연도 선택 */}
				<View style={styles.selectYear}>
					<Text style={{ fontSize: 24 }}>{currentYear}</Text>
				</View>
				{/* 월 선택 */}
				<View style={styles.selectMonth}>
					<Text style={{ fontSize: 40 }}>{currentMonth}</Text>
				</View>
			</View>
			{/* 일정 추가 버튼 */}
			<TouchableOpacity style={styles.addBtnContainer}>
				<AntDesign name="plus" size={24} color="black" />
			</TouchableOpacity>
			{/* 일정 리스트 */}
			<ScheduleList></ScheduleList>
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
		gap: 20,
	},
	selectYear: {
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'black',
	},
	selectMonth: {
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'black',
	},
	addBtnContainer: {
		width: '80%',
		alignItems: 'flex-end',
	},
});
