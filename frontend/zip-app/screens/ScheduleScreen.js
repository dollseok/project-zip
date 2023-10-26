import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import ScheduleList from '../components/schedule/ScheduleList';

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
				<View style={styles.selectYear}>
					<Text style={{ fontSize: 24 }}>{currentYear}</Text>
				</View>
				<View style={styles.selectMonth}>
					<Text style={{ fontSize: 40 }}>{currentMonth}</Text>
				</View>
			</View>
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
});
