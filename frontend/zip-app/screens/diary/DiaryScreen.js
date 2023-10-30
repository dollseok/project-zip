import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import PickYearMonth from '../../components/PickYearMonth';

export default function DiaryScreen() {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 초기 년도 설정
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 초기 월 설정 (1은 1월을 의미)

	const handleYearChange = (year) => {
		setSelectedYear(year);
	};

	const handleMonthChange = (month) => {
		setSelectedMonth(month);
	};

	return (
		<View style={styles.container}>
			<PickYearMonth />
			<View style={styles.diaryList}>
				<Text>일기 리스트</Text>
			</View>
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
});
