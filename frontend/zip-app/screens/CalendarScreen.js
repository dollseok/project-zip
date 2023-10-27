import { StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScheduleScreen from './ScheduleScreen';
import SchedulePreview from '../components/schedule/SchedulePreview';

// 달력 현지화
LocaleConfig.locales['fr'] = {
	monthNames: [
		'01',
		'02',
		'03',
		'04',
		'05',
		'06',
		'07',
		'08',
		'09',
		'10',
		'11',
		'12',
	],
	monthNamesShort: [
		'01',
		'02',
		'03',
		'04',
		'05',
		'06',
		'07',
		'08',
		'09',
		'10',
		'11',
		'12',
	],
	dayNames: [
		'일요일',
		'월요일',
		'화요일',
		'수요일',
		'목요일',
		'금요일',
		'토요일',
	],
	dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
	today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

const customTheme = {
	'stylesheet.calendar.header': {
		// 일요일 색상 변경
		dayTextAtIndex0: {
			color: 'red',
		},
		// 월 ~ 토요일 검정색 변경
		dayTextAtIndex1: {
			color: 'black',
		},
		dayTextAtIndex2: {
			color: 'black',
		},
		dayTextAtIndex3: {
			color: 'black',
		},
		dayTextAtIndex4: {
			color: 'black',
		},
		dayTextAtIndex5: {
			color: 'black',
		},
		dayTextAtIndex6: {
			color: 'black',
		},
		monthText: {
			// 월 글씨 크기
			fontSize: 24,
			fontWeight: 'bold',
		},
		yearText: {
			// 연도 글씨 크기
			fontSize: 24,
			fontWeight: 'bold',
		},
	},
	selectedDayBackgroundColor: 'black', // 선택된 날짜 배경색
	arrowColor: 'black',
	todayTextColor: 'white',
	todayBackgroundColor: 'tomato',
	// 일자 폰트 (1, 2, ... , 31)
	textDayFontWeight: '800',
	textDayFontSize: 24,
	// 요일 폰트 (일, 월, ..., 토)
	textDayHeaderFontWeight: '800',
	textDayHeaderFontSize: 24,
};

export default function CalendarScreen({ navigation }) {
	const posts = [
		{
			scheduleId: 1,
			title: '가족여행',
			startDate: '2023-10-25',
			endDate: '2023-10-26',
			plan: [
				{
					planId: 1,
					memberId: 1,
					status_code: 0,
					title: '제주도 비행기 표 예매',
					content: '25일 점심먹고 출발 ~~ 어쩌구 ~~',
				},
				{
					planId: 2,
					memberId: 1,
					status_code: 0,
					title: '연돈 예약하기',
					content: '25일 저녁!!',
				},
			],
		},
		{
			scheduleId: 2,
			title: '어머니 생신',
			startDate: '2023-10-28',
			endDate: '2023-10-28',
		},
	];

	const markedDates = posts.reduce((acc, current) => {
		const formattedDate = format(new Date(current.startDate), 'yyyy-MM-dd');
		acc[formattedDate] = { marked: true };
		return acc;
	}, {});

	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), 'yyyy-MM-dd'),
	);

	const markedSelectedDates = {
		...markedDates,
		[selectedDate]: {
			selected: true,
			marked: markedDates[selectedDate]?.marked,
		},
	};

	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

	// 일정 미리보기 팝업
	const [modalVisible, setModalVisible] = useState(false);
	const onModal = () => {
		setModalVisible(true);
	};

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
			<View style={styles.calendarContainer}>
				<Calendar
					style={styles.calendar}
					markedDates={markedSelectedDates}
					// 달력 타이틀 커스텀 => 2023 10
					monthFormat="yyyy년 MM월"
					// 스와이프로 월 변경 가능
					enableSwipeMonths={true}
					theme={customTheme}
					onDayPress={(day) => {
						setSelectedDate(day.dateString);
						onModal();
						// navigation.navigate('일정', {
						// 	dateInfo: day.dateString,
						// });
					}}
					onMonthChange={(month) => {
						setCurrentYear(month.year);
						setCurrentMonth(month.month);
					}}
				/>
			</View>
			<SchedulePreview
				selectedDate={selectedDate}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
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
	calendarContainer: {
		marginTop: 20,
		// alignItems: 'center',
		// justifyContent: 'center',
		width: '100%',
		height: '50%',
	},
	calendar: {
		borderBottonWidth: 1,
		borderBottonColor: '#e0e0e0',
		width: '100%',
		height: '100%',
	},
});
