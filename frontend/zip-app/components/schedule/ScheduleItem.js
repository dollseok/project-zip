import {
	LayoutAnimation,
	StyleSheet,
	View,
	FlatList,
	Text,
	TouchableOpacity,
} from 'react-native';
import { useState } from 'react';

export default function ScheduleItem({ schedule }) {
	const scheduleDay = schedule.startDate.split('-')[2];
	// 일정 아이템이 확장되었는지 여부
	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = () => {
		LayoutAnimation.easeInEaseOut();
		setExpanded(!expanded);
	};

	return (
		<TouchableOpacity
			style={[styles.eachItem, expanded ? styles.expandedItem : null]}
			onPress={toggleExpanded}
		>
			<View
				style={[
					styles.eachSchedule,
					styles.shadowProps,
					expanded ? styles.expandedItem : null,
				]}
			>
				{/* 일정 정보 */}
				{expanded ? <Text>일정</Text> : null}
				<View style={styles.scheduleInfo}>
					{/* 일자 */}
					<View style={styles.scheduleDay}>
						<View style={styles.dayText}>
							<Text style={styles.scheduleDayFont}>{scheduleDay}</Text>
							<Text style={{ fontSize: 15 }}>일</Text>
						</View>
					</View>
					{/* 제목 */}
					<View style={styles.scheduleTitle}>
						<Text style={{ fontSize: 20, fontWeight: '600' }}>
							{schedule.title}
						</Text>
					</View>
					{/* 준비 상태 */}
					<View style={styles.ready}>
						<Text>준비중</Text>
						<Text>준비완료</Text>
					</View>
				</View>
				{/* 계획 목록 */}
				{expanded ? (
					<View style={styles.planInfo}>
						{schedule.plan ? (
							<FlatList
								data={schedule.plan}
								keyExtractor={(item) => item.planId.toString()}
								renderItem={({ item }) => (
									<View>
										<Text>{item.title}</Text>
										<Text>{item.planId}</Text>
									</View>
								)}
							/>
						) : (
							<View>
								<Text>아직 등록된 할 일이 없습니다.</Text>
							</View>
						)}
					</View>
				) : null}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	eachItem: {
		width: '100%',
		height: 71,
	},
	// 일정 아이템 스타일
	eachSchedule: {
		gap: 10,

		backgroundColor: 'white',
		borderRadius: 16,

		width: '100%',
		height: 71,

		padding: 10,
	},
	// 확장 되었을 때 스타일
	expandedItem: {
		height: 200,
	},
	shadowProps: {
		// ios
		shadowColor: '#000000',
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		// android
		elevation: 8,
	},
	dayText: {
		flexDirection: 'row',
		alignItems: 'baseline',
		gap: 3,
	},
	scheduleDay: {
		flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
		flex: 1,
		width: 30,
	},
	scheduleDayFont: {
		fontSize: 30,
		fontWeight: 'bold',

		textAlignVertical: 'bottom',
	},
	scheduleTitle: {
		flex: 2,
	},
	ready: {
		flex: 1,
	},
	scheduleInfo: {
		flexDirection: 'row',
	},
	planInfo: {
		borderColor: 'black',
		borderWidth: 1,
	},
});
