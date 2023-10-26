import { StyleSheet, View, Text } from 'react-native';

export default function ScheduleItem({ schedule }) {
	const scheduleDay = schedule.startDate.split('-')[2];

	return (
		<View style={[styles.eachSchedule, styles.shadowProps]}>
			<View style={styles.scheduleDay}>
				<Text style={styles.scheduleDayFont}>{scheduleDay}</Text>
				<Text style={{ fontSize: 15 }}>일</Text>
			</View>
			<View style={styles.scheduleTitle}>
				<Text>{schedule.title}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	eachSchedule: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,

		backgroundColor: 'white',
		borderRadius: 16,

		width: '90%',
		height: 71,

		padding: 10,
	},
	shadowProps: {
		shadowColor: '#000000',
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		elevation: 3,
	},
	scheduleDay: {
		flexDirection: 'row',
		alignItems: 'center',

		width: 30,
		flex: 1,
	},
	scheduleDayFont: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	scheduleTitle: {
		flex: 3,
	},
});
