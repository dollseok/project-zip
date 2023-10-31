import { StyleSheet, View, Text } from 'react-native';
import DiaryItem from './DiaryItem';

export default function DiaryList() {
	const diarys = [
		{
			diaryId: 1,
			name: '종인',
			nickname: '작은아들',
			title: '고기먹고싶다',
			content: '이베리코 통목살...!',
			createdAt: '2023-10-31 10:30',
			diaryPhoto: [],
			comment: [
				{
					id: 1,
					name: '은석',
					nickname: '큰아들',
					content: '나도 고기...',
					createAt: '2023-10-31 12:30',
					updatedAt: '2023-10-31 12:30',
				},
			],
		},
		{
			diaryId: 2,
			name: '종인',
			nickname: '작은아들',
			title: '고기먹고싶다',
			content: '이베리코 통목살...!',
			createdAt: '2023-10-31 10:30',
			diaryPhoto: [],
			comment: [
				{
					id: 2,
					name: '은석',
					nickname: '큰아들',
					content: '나도 고기...',
					createAt: '2023-10-31 12:30',
					updatedAt: '2023-10-31 12:30',
				},
			],
		},
	];

	return (
		<View style={styles.diaryList}>
			{diarys.map((diary) => {
				return <DiaryItem diary={diary} key={diary.diaryId}></DiaryItem>;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	diaryList: {
		marginTop: 20,
		// borderWidth: 1,
		// borderColor: 'black',
		alignItems: 'center',
		width: '80%',
		height: '60%',
		gap: 10, // 일정별 간격
	},
});
