import { StyleSheet, View, Text } from 'react-native';
import ScheduleItem from './ScheduleItem';

export default function ScheduleList() {
	const schedules = [
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
			],
		},
		{
			scheduleId: 2,
			title: '어머니 생신',
			startDate: '2023-10-28',
			endDate: '2023-10-28',
		},
	];

	return (
		<View style={styles.scheduleList}>
			{schedules.map((schedule, idx) => {
				return <ScheduleItem schedule={schedule} key={idx}></ScheduleItem>;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	scheduleList: {
		marginTop: 20,
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		width: '80%',
		height: '60%',
		gap: 10, // 일정별 간격
	},
});
