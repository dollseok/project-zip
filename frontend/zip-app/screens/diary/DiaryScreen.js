import { StyleSheet, Text, View } from 'react-native';

export default function DiaryScreen() {
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
	diaryList: {
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
		width: 300,
		height: 400,
	},
});
