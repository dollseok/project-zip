import { StyleSheet, View, Text } from 'react-native';

export default function DiaryItem({ diary }) {
	const diaryDay = diary.createdAt.split(' ')[0].split('-')[2];
	return (
		<View style={[styles.eachDiary, styles.shadowProps]}>
			{/* 일자 */}
			<View style={styles.diaryDay}>
				<Text style={styles.diaryDayFont}>{diaryDay}</Text>
				<Text style={styles.diaryDayUnitFont}>일</Text>
			</View>
			<View style={styles.diarySummary}>
				{/* 닉네임과 감정아이콘 */}
				<View style={styles.diaryAuthor}>
					<View>
						<Text style={styles.diaryNicknameFont}>{diary.nickname}</Text>
					</View>
					<View>
						<Text>감정아이콘</Text>
					</View>
				</View>
				{/* 제목 */}
				<View style={styles.diaryTitle}>
					<Text>{diary.title}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	eachDiary: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 16,
		width: '100%',
		gap: 10,
		padding: 20,
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
	// 일기 날짜
	diaryDay: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	diaryDayFont: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	diaryDayUnitFont: {
		fontSize: 15,
		alignSelf: 'flex-end',
		paddingBottom: 10,
	},
	// 일기 요약 (작성자, 감정아이콘, 제목)
	diarySummary: {
		gap: 5,
	},
	// 일기 작성자
	diaryAuthor: {
		flexDirection: 'row',
		gap: 5,
	},
	diaryNicknameFont: {
		fontSize: 18,
		fontWeight: '700',
	},
});
