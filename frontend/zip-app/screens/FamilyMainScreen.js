import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
	Image,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../util/Interceptor';

export default function FamilyMainScreen() {
	const [family, setFamily] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [diaries, setDiaries] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태 추가
	

	// 편집 모드를 토글하는 함수
	const toggleEditMode = () => {
		setIsEditMode((prevMode) => !prevMode);
	};

	const handleEdit = () => {
		setIsEditMode(true);
	  };
	

	const handleSave = () => {
		setFamily({ ...family, familyName: newFamilyName });
		setIsEditMode(false);
	  };

	useEffect(() => {
		async function fetchData() {
			const familyId = 1;

			axiosInstance
				.get(`/family/choice?familyId=${familyId}`)
				.then((response) => {
					setFamily(response.data.family);
				});

			axiosInstance
				.get(`/schedule/list?familyId=${familyId}`)
				.then((response) => {
					console.log('일정 : ', response.data.list);
					setSchedules(response.data.list);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});

			axiosInstance
				.get(`/diary/list?familyId=${familyId}`)
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
			// source={{ uri: family.familyProfileImgUrl }}
			style={styles.container}
			resizeMode="cover"
		>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
					<Image
						source={require('../assets/geer.png')}
						style={styles.editButton}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.familyTextContainer}>
				<Text style={styles.familyName}>{family.familyName}</Text>
				{isEditMode && (
					<TouchableOpacity
						style={styles.editButtonFamilyText}
						onPress={() => {}}
					>
						<Image
							source={require('../assets/pencil.png')}
							style={styles.editButtonIcon}
						/>
					</TouchableOpacity>
				)}

				<Text style={styles.familyContent}>{family.familyContent}</Text>
				{isEditMode && (
					<TouchableOpacity
						style={styles.editButtonFamilyText}
						onPress={() => {}}
					>
						<Image
							source={require('../assets/pencil.png')}
							style={styles.editButtonIcon}
						/>
					</TouchableOpacity>
				)}
			</View>

			<Image
				source={{ uri: family.memberProfileImgUrl }}
				style={styles.memberImage}
			/>

			<Text style={styles.headingSchedule}>일정</Text>
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
			<Text style={styles.headingDiary}>일기</Text>
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
		backgroundColor: 'black'
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end', // 이 부분 변경
		paddingHorizontal: 20,
		paddingTop: 30,
	},
	editButton: {
		width: 30,
		height: 30,
	},
	familyTextContainer: {
		flexDirection: 'row', // 아이템을 가로 방향으로 배열
		alignItems: 'center', 
		justifyContent: 'center', // 아이템들 사이의 간격을 최대로 설정
		width: '100%', // 컨테이너의 너비를 최대로 설정하여 오른쪽 끝에 연필 아이콘이 위치하도록 함
		paddingHorizontal: 10, // 좌우 패딩을 설정하여 아이템들이 가장자리에 닿지 않게 함
	},
	familyName: {
		fontSize: 30,
		marginTop: 20,
		fontWeight: 'bold',
		color: 'white',
	},
	familyContent: {
		fontSize: 20,
		color: 'white',
		marginTop: 10,
	},
	memberImage: {
		width: 100, // 원하는 이미지 크기로 조정
		height: 100, // 원하는 이미지 크기로 조정
		marginTop: 20,
		borderRadius: 50, // 원형 이미지를 위해
	},
	headingSchedule: {
		fontSize: 25,
		fontWeight: 'bold',
		color: 'white',
		marginTop: 30,
		marginBottom: 20,
	},
	headingDiary: {
		fontSize: 25,
		fontWeight: 'bold',
		color: 'white',
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
	// ... 기존 스타일
	editModeButton: {
		position: 'absolute',
		top: 10,
		left: 10,
	},
	editButtonFamilyText: {

	},
});
