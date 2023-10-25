import { StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { useState } from 'react';

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
		dayTextAtIndex0: {
			// 일요일 색상 변경
			color: 'red',
		},
		dayTextAtIndex6: {
			// 토요일 색상 변경
			color: 'blue',
		},
		monthText: {
			// 월 글씨 크기
			fontSize: 24,
		},
		yearText: {
			// 연도 글씨 크기
			fontSize: 24,
		},
	},
	selectedDayBackgroundColor: 'black', // 선택된 날짜 배경색
	arrowColor: 'black',
	todayTextColor: 'white',
	todayBackgroundColor: 'tomato',
	// 일자 폰트 (1, 2, ... , 31)
	textDayFontWeight: '800',
	textDayFontSize: 24,
	// 헤더 폰트 (일, 월, ..., 토)
	textDayHeaderFontWeight: '800',
	textDayHeaderFontSize: 24,
};

export default function CalendarScreen() {
	const posts = [
		{
			id: 1,
			title: '제목',
			contents: '내용',
			date: '2023-10-24',
		},
		{
			id: 2,
			title: '제목',
			contents: '내용',
			date: '2023-10-25',
		},
	];

	const markedDates = posts.reduce((acc, current) => {
		const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
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

	return (
		<View style={styles.container}>
			<View style={styles.dateContainer}>
				<View style={styles.selectYear}>
					<Text>연도 선택</Text>
				</View>
				<View style={styles.selectMonth}>
					<Text>월 선택</Text>
				</View>
			</View>
			<View style={styles.calendarContainer}>
				<Calendar
					style={styles.calendar}
					markedDates={markedSelectedDates}
					// 달력 타이틀 커스텀 => 2023 10
					monthFormat="yyyy MM"
					// 스와이프로 월 변경 가능
					enableSwipeMonths={true}
					theme={customTheme}
					onDayPress={(day) => {
						setSelectedDate(day.dateString);
					}}
				/>
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
	dateContainer: {
		flexDirection: 'row',
		gap: 50,
	},
	selectYear: {
		borderWidth: 1,
		borderColor: 'black',
	},
	selectMonth: {
		borderWidth: 1,
		borderColor: 'black',
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
