import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScheduleScreen from './ScheduleScreen';
import SchedulePreview from '../components/schedule/SchedulePreview';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 초기 년도 설정
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 초기 월 설정 (1은 1월을 의미)

	const [isModalVisible, setisModalVisible] = useState(false);
	const showPickerModal = () => {
		setisModalVisible(true);
	};

	const hidePickerModal = () => {
		setisModalVisible(false);
	};

	const [calendarKey, setCalendarKey] = useState(1);
	const [calendarDate, setCalendarDate] = useState(
		format(new Date(), 'yyyy-MM-dd'),
	);

	const handleYearChange = (year) => {
		setSelectedYear(year);
		updateCalendarDate(year, selectedMonth);
	};

	const handleMonthChange = (month) => {
		setSelectedMonth(month);
		updateCalendarDate(selectedYear, month);
	};

	const updateCalendarDate = (year, month) => {
		const formattedDate = `${year}-${month.toString().padStart(2, '0')}-01`;
		setCalendarDate(formattedDate);
	};

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
				<TouchableOpacity onPress={showPickerModal}>
					<Text>날짜 선택</Text>
				</TouchableOpacity>
				<Modal visible={isModalVisible} animationType="slide">
					<View>
						<Picker
							selectedValue={selectedYear}
							onValueChange={handleYearChange}
						>
							<Picker.Item label="2020" value={2020} />
							<Picker.Item label="2021" value={2021} />
							<Picker.Item label="2022" value={2022} />
							<Picker.Item label="2023" value={2023} />
						</Picker>
						<Picker
							selectedValue={selectedMonth}
							onValueChange={handleMonthChange}
						>
							<Picker.Item label="1" value={1} />
							<Picker.Item label="2" value={2} />
							<Picker.Item label="3" value={3} />
							<Picker.Item label="4" value={4} />
							<Picker.Item label="5" value={5} />
							<Picker.Item label="6" value={6} />
							<Picker.Item label="7" value={7} />
							<Picker.Item label="8" value={8} />
							<Picker.Item label="9" value={9} />
							<Picker.Item label="10" value={10} />
							<Picker.Item label="11" value={11} />
							<Picker.Item label="12" value={12} />
						</Picker>
						<TouchableOpacity onPress={hidePickerModal}>
							<Text>Done</Text>
						</TouchableOpacity>
					</View>
				</Modal>
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
					}}
					onMonthChange={(month) => {
						setCurrentYear(month.year);
						setCurrentMonth(month.month);
					}}
				/>
			</View>
			<SchedulePreview
				navigation={navigation}
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
