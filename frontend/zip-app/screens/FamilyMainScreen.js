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
import * as ImagePicker from 'expo-image-picker';

export default function FamilyMainScreen({ route }) {
	const [family, setFamily] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [diaries, setDiaries] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
	const [isFamilyNameEditMode, setIsFamilyNameEditMode] = useState(false); // 가족 이름 편집 모드 상태
	const [isFamilyContentEditMode, setIsFamilyContentEditMode] = useState(false); // 가족 이름 편집 모드 상태

	// photo 입력받는 button을 눌렀을 때 실행되는 함수
	const _handlePhotoBtnPress = async () => {
		// image library 접근에 대한 허가 필요 없음
		// ImagePicker를 이용해 Image형식의 파일을 가져온다
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		// cancelled가 아닐 때 가져온 사진의 주소로 onChangePhoto
		if (!result.cancelled) {
			onChangePhoto(result.uri);
		}
	};

	// onChangePhoto 함수 정의
	const onChangePhoto = (photoUri) => {
		// 가져온 사진의 URI를 이용하여 원하는 작업 수행
		console.log(`Selected photo URI: ${photoUri}`);
		// 예를 들어, state를 업데이트하거나 다른 작업을 수행할 수 있습니다.
	};

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
			const familyId = await AsyncStorage.getItem('familyId');
			
			console.log("선택한 가족 ID : ", familyId);

			axiosInstance
				.get(`/family/choice?familyId=${familyId}`)
				.then((response) => {
					console.log("가족 정보 : ", response.data.data);
					setFamily(response.data.data);
				});

			axiosInstance
				.get(`/schedule/list?familyId=${familyId}`)
				.then((response) => {
					setSchedules(response.data.list);
					console.log('일정 : ', schedules);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});

			axiosInstance
				.get(`/diary/list?familyId=${familyId}`)
				.then((response) => {
					setDiaries(response.data.list);
					console.log('일기 : ', diaries);
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
				{isEditMode ? (
					<>
						<TouchableOpacity onPress={_handlePhotoBtnPress}>
							<Image source={require('../assets/camera.png')} style={{}} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setIsEditMode(false);
								setIsFamilyNameEditMode(false);
								setIsFamilyContentEditMode(false);
							}}
						>
							<Text style={{ color: 'white', fontSize: 20 }}>완료</Text>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						onPress={() => {
							setIsEditMode(true);
						}}
					>
						<Image
							source={require('../assets/geer.png')}
							style={styles.editButton}
						/>
					</TouchableOpacity>
				)}
			</View>

			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center' },
					isEditMode
						? {
								borderBottomWidth: 1,
								borderBottomColor: 'white',
								marginHorizontal: 60,
						  }
						: { borderBottomWidth: 0 },
				]}
			>
				{isEditMode && isFamilyNameEditMode ? (
					<TextInput
						style={familyStyles.familyName}
						defaultValue={family.familyName}
						editable={isFamilyNameEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
						onChangeText={(text) => {
							// 텍스트 변경을 처리하는 코드
						}}
						autoFocus={isFamilyNameEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
					/>
				) : (
					<Text style={familyStyles.familyName}>{family.familyName}</Text>
				)}

				{isEditMode && (
					<TouchableOpacity
						style={[
							familyStyles.editButtonFamilyText,
							{ position: 'absolute', right: 0, paddingTop: 5 },
						]}
						onPress={() => setIsFamilyNameEditMode(true)}
					>
						<Image
							source={require('../assets/pencil.png')}
							style={styles.editButtonIcon}
						/>
					</TouchableOpacity>
				)}
			</View>

			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center', marginTop: 5 },
					isEditMode
						? {
								borderBottomWidth: 1,
								borderBottomColor: 'white',
								marginHorizontal: 60,
						  }
						: { borderBottomWidth: 0 },
				]}
			>
				{isEditMode && isFamilyContentEditMode ? (
					<TextInput
						style={familyStyles.familyContent}
						defaultValue={family.familyContent}
						editable={isFamilyContentEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
						onChangeText={(text) => {
							// 텍스트 변경을 처리하는 코드
						}}
						autoFocus={isFamilyContentEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
					/>
				) : (
					<Text style={familyStyles.familyContent}>{family.familyContent}</Text>
				)}

				{isEditMode && (
					<TouchableOpacity
						style={[
							familyStyles.editButtonFamilyText,
							{ position: 'absolute', right: 0 },
						]}
						onPress={() => setIsFamilyContentEditMode(true)}
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
		backgroundColor: 'gray',
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between', // 이 부분 변경
		paddingHorizontal: 20,
		paddingTop: 30,
	},
	editButton: {
		// justifyContent: 'flex-end',
		width: 30,
		height: 30,
	},
	memberImage: {
		width: 80, // 원하는 이미지 크기로 조정
		height: 80, // 원하는 이미지 크기로 조정
		marginTop: 20,
		borderRadius: 50, // 원형 이미지를 위해
	},
	headingSchedule: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginTop: 30,
		marginBottom: 10,
	},
	headingDiary: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 10,
	},
	scheduleItem: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 7,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	userImage: {
		width: 20,
		height: 20,
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
		padding: 7,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
});

const familyStyles = StyleSheet.create({
	familyName: {
		flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		marginTop: 20,
	},

	editButtonFamilyText: {
		width: 20,
		height: 20,
		// marginRight: 30,
	},

	familyContent: {
		flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
		fontSize: 16,
		color: 'white',
		marginTop: 20,
		textAlign: 'center',
	},
});
