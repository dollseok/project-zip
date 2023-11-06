import { StyleSheet, View, Text, Image } from 'react-native';
import axiosInstance from '../../util/Interceptor';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';

export default function DiaryItem({ diarySummary }) {
	const [diary, setDiary] = useState([]);

	const getDiaryDetail = () => {
		axiosInstance
			.get(`/diary/detail`, {
				params: {
					diaryId: diarySummary.diaryId,
				},
			})
			.then((res) => {
				console.log('일기 상세정보: ', res.data.data);
				setDiary(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const formatDay = (createdAt) => {
		// createdAt 형식 '2023-11-06'
		if (createdAt) {
			return createdAt.split('-')[2];
		}
	};

	useEffect(() => {
		getDiaryDetail();
	}, []);

	return (
		<View style={[styles.eachDiary, styles.shadowProps]}>
			{/* 일자 */}
			<View style={styles.diaryDay}>
				<Text style={styles.diaryDayFont}>{formatDay(diary.createdAt)}</Text>
				<Text style={styles.diaryDayUnitFont}>일</Text>
			</View>
			<View style={styles.diarySummary}>
				{/* 닉네임과 감정아이콘 */}
				<View style={styles.diaryAuthor}>
					<View>
						<Text style={styles.diaryNicknameFont}>{diary.name}</Text>
					</View>
					<View>
						{/* {diary.emotionId === 1 ? (
							<Image
								style={{ width: 24, height: 24 }}
								source={require('../../assets/emotion/smile.png')}
							/>
						) : (
							<></>
						)} */}
					</View>
				</View>
				{/* 제목 */}
				<View style={styles.diaryTitle}>
					<Text>제목</Text>
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
