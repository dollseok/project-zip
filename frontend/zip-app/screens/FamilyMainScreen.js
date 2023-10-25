import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
	Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function FamilyMainScreen() {
	const [schedules, setSchedules] = useState([]);
	const [diaries, setDiaries] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const familyId = 1;
			const accessToken = await AsyncStorage.getItem('accessToken');

			axios
				.get(`http://localhost:9090/api/schedule/list?familyId=${familyId}`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					console.log('일정 : ', response.data.list);
					setSchedules(response.data.list);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});

			// 일기 리스트 데이터 불러오기
			axios
				.get(`http://localhost:9090/api/diary/list?familyId=${familyId}`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					console.log('일기 : ', response.data.list);
					setDiaries(response.data.list);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});
		}

		fetchData();
	}, []);

	return (
		<ImageBackground
			source={require('../assets/family.png')}
			style={styles.container}
			resizeMode="cover"
		>
			<Text style={styles.heading}>일정</Text>
			<FlatList
				data={schedules}
				renderItem={({ item }) => (
					<View style={styles.scheduleItem}>
						<Image
							source={require('../assets/user.png')}
							style={styles.userImage}
						/>
						<Text style={styles.whiteText}>{item.memberId}</Text>
						<Text style={styles.whiteText}>{item.name}</Text>
					</View>
				)}
				keyExtractor={(item) => item.scheduleId.toString()}
			/>
			{/* 일기 리스트 출력 */}
			<Text style={styles.heading}>일기</Text>
			<FlatList
				data={diaries}
				renderItem={({ item }) => (
					<View style={styles.diaryItem}>
						<Image
							source={require('../assets/user.png')}
							style={styles.userImage}
						/>
						<Text style={styles.whiteText}>{item.nickname}</Text>
						<Text style={styles.whiteText}>{item.title}</Text>
					</View>
				)}
				keyExtractor={(item) => item.diaryId.toString()}
			/>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		marginTop: 40,
		marginBottom: 20,
	},
	scheduleItem: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 10,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	userImage: {
		width: 40,
		height: 40,
		marginRight: 30, // 간격을 15로 조절했습니다.
		borderRadius: 20,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		marginRight: 30, // 간격을 15로 조절했습니다.
	},
	diaryItem: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 10,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
});
