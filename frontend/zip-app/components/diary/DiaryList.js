import { StyleSheet, View, Text, FlatList } from 'react-native';
import DiaryItem from './DiaryItem';
import { useState } from 'react';

export default function DiaryList(props) {
	const { diarys } = props;
	console.log('해당 월의 일기리스트: ', diarys);

	return (
		<View style={styles.diaryList}>
			{!diarys.length ? <Text>등록된 일기가 없습니다.</Text> : <></>}
			{diarys.map((diary) => {
				return <DiaryItem diarySummary={diary} key={diary.diaryId}></DiaryItem>;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	diaryList: {
		marginTop: 20,
		// borderWidth: 1,
		// borderColor: 'black',
		// alignItems: 'center',
		width: '80%',
		height: '60%',
		gap: 10, // 일정별 간격
	},
});
