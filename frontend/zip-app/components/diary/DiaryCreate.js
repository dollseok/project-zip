import { useRef, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Image,
	ImageBackground,
	Text,
	TextInput,
	Modal,
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SelectDropdown from 'react-native-select-dropdown';

export default function DiaryCreate(props) {
	const {
		selectedYear,
		selectedMonth,
		createModalVisible,
		setCreateModalVisible,
	} = props;
	const screenHeight = Dimensions.get('screen').height;
	const panY = useRef(new Animated.Value(screenHeight)).current;
	const translateY = panY.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	});

	const resetDiaryCreate = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	});
	const closeDiaryCreate = Animated.timing(panY, {
		toValue: screenHeight,
		duration: 300,
		useNativeDriver: true,
	});

	const panResponders = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => false,
			onPanResponderMove: (event, gestureState) => {
				panY.setValue(gestureState.dy);
			},
			onPanResponderRelease: (event, gestureState) => {
				if (gestureState.dy > 0 && gestureState.vy > 1.5) {
					closeModal();
				} else {
					resetDiaryCreate.start();
				}
			},
		}),
	).current;

	useEffect(() => {
		if (props.createModalVisible) {
			resetDiaryCreate.start();
		} else {
			closeDiaryCreate.start();
		}
	}, [props.createModalVisible]);

	const closeModal = () => {
		closeDiaryCreate.start(() => {
			setCreateModalVisible(false);
		});
	};

	// // 일자 선택 설정
	// 연월 정보를 기반으로 일 수 계산
	function getDaysInMonth(year, month) {
		return new Date(year, month, 0).getDate();
	}

	const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
	// 일자 리스트 생성
	const dateList = [];
	for (let day = 1; day <= daysInMonth; day++) {
		dateList.push(day);
	}

	// // 감정 선택 설정
	// 초기 감정 상태 설정
	const [selectedEmotion, setSelectedEmotion] = useState('smile');

	// 감정을 선택하는 함수
	const selectEmotion = (emotion) => {
		setSelectedEmotion(emotion);
	};
	// 감정이 선택되었는지 확인하는 함수
	const isEmotionSelected = (emotion) => {
		return selectedEmotion === emotion;
	};

	// 인풋 관련 설정
	const [diaryTitle, setDiaryTitle] = useState('');
	const [diaryContent, setDiaryContent] = useState('');

	// // 사진 업로드
	// 현재 이미지 주소
	const [imageUrl, setImageUrl] = useState('');
	// 권한 요청을 위한 hooks
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

	const uploadImage = async () => {
		// 권한 확인 코드: 권한 없으면 물어보고, 승인하지 않으면 함수 종료
		if (!status?.granted) {
			const permission = await requestPermission();
			if (!permission.granted) {
				return null;
			}
		}
		// 이미지 업로드 기능
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images, // 어떤 타입의 파일을 업로드 할지
			allowsEditing: false, // 이미지 업로드 전 자르기 등의 추가 편집 가능 여부
			quality: 1, // 이미지 압축 여부. 1로 설정하면 가장 높은 품질
			aspect: [1, 1], // 이미지 비율 설정
		});
		if (result.canceled) {
			return null; // 이미지 업로드 취소한 경우
		} else {
			// 이미지 업로드 결과 및 이미지 경로 업데이트
			setImageUrl(result.assets[0].uri);
		}
		// result.uri 해도 잘 되지만 deprecated 되었다고 warn 메시지가 뜸
		// console에 cancelled 라는 내용이 찍히면 warn 메시지가 출력되는 듯
		// console.log 제거하니까 오류 사라짐!

		// 서버에 요청 보내기
		const localUri = result.assets[0].uri;
		const filename = localUri.split('/').pop();
		const match = /\.(\w+)$/.exec(filename ?? '');
		const type = match ? `image/${match[1]}` : `image`;
		const formData = new FormData();

		formData.append('image', { uri: localUri, name: filename, type });

		// await axios({
		//   method: 'post',
		//   url: '{api주소}',
		//   headers: {
		//     'content-type': 'multipart/form-data',
		//   },
		//   data: formData
		// })
	};

	return (
		<Modal
			visible={createModalVisible}
			animationType={'fade'}
			transparent
			statusBarTranslucent
		>
			<View style={styles.overlay}>
				<TouchableWithoutFeedback>
					<View style={styles.background} />
				</TouchableWithoutFeedback>
				<Animated.View
					style={{
						...styles.bottomSheetContainer,
						transform: [{ translateY: translateY }],
					}}
					{...panResponders.panHandlers}
				>
					<ImageBackground
						style={styles.bgImage}
						imageStyle={{ opacity: 0.8 }}
						source={imageUrl ? { uri: imageUrl } : null}
					>
						<View style={styles.createFormContainer}>
							{/* 취소 & 등록 버튼 */}
							<View style={styles.buttonContainer}>
								{/* 취소 버튼 */}
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={closeModal}
								>
									<Text>취소</Text>
								</TouchableOpacity>
								{/* 등록 버튼 */}
								<View style={styles.writeButton}>
									<Text>완료</Text>
								</View>
							</View>
							{/* 일자 및 감정 선택 */}
							<View style={styles.dayEmotionContainer}>
								<View style={styles.dayContainer}>
									<SelectDropdown
										data={dateList}
										defaultValueByIndex={0}
										buttonStyle={{
											backgroundColor: 'white',
											width: '35%',
										}}
										buttonTextStyle={{
											fontSize: 40,
											fontWeight: '700',
										}}
										renderDropdownIcon={() => (
											<AntDesign name="caretdown" size={18} color="grey" />
										)}
										// 드랍다운 내려왔을 때 텍스트스타일
										rowTextStyle={{
											fontSize: 20,
										}}
									/>
								</View>
								<View style={styles.emotionContainer}>
									<TouchableOpacity onPress={() => selectEmotion('smile')}>
										<Image
											style={[
												styles.emotionIcon,
												isEmotionSelected('smile')
													? null
													: styles.blurEmotionIcon,
											]}
											source={require('../../assets/emotion/smile.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => selectEmotion('wow')}>
										<Image
											style={[
												styles.emotionIcon,
												isEmotionSelected('wow')
													? null
													: styles.blurEmotionIcon,
											]}
											source={require('../../assets/emotion/wow.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => selectEmotion('sad')}>
										<Image
											style={[
												styles.emotionIcon,
												isEmotionSelected('sad')
													? null
													: styles.blurEmotionIcon,
											]}
											source={require('../../assets/emotion/sad.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => selectEmotion('angry')}>
										<Image
											style={[
												styles.emotionIcon,
												isEmotionSelected('angry')
													? null
													: styles.blurEmotionIcon,
											]}
											source={require('../../assets/emotion/angry.png')}
										/>
									</TouchableOpacity>
								</View>
							</View>
							{/* 제목 및 내용 입력 */}
							<View style={styles.contentContainer}>
								<TextInput
									placeholder="제목"
									style={styles.titleInput}
									onChangeText={(text) => {
										setDiaryTitle(text);
									}}
									value={diaryTitle}
								/>
								<TextInput
									placeholder="내용"
									style={styles.contentInput}
									onChangeText={(content) => {
										setDiaryContent(content);
									}}
									multiline={true}
									numberOfLines={4}
									value={diaryContent}
								/>
							</View>
							{/* 사진 업로드 */}
							<View style={styles.photoUpload}>
								<TouchableOpacity onPress={uploadImage}>
									<Ionicons name="ios-camera-outline" size={40} color="black" />
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>
				</Animated.View>
				<TouchableWithoutFeedback>
					<View style={styles.background} />
				</TouchableWithoutFeedback>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	background: {
		flex: 1,
	},
	bottomSheetContainer: {
		height: 400,
		backgroundColor: 'white',
		borderRadius: 20,
		marginHorizontal: 15,
		marginBottom: 15,
	},
	createFormContainer: {
		padding: 20,
		gap: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dayEmotionContainer: {
		gap: 20,
	},
	dayContainer: {
		alignItems: 'center',
	},
	emotionContainer: {
		flexDirection: 'row',
		justifyContent: 'center',

		gap: 10,
	},
	emotionIcon: {
		width: 28,
		height: 28,
	},
	blurEmotionIcon: {
		opacity: 0.5,
	},
	contentContainer: {},
	titleInput: {
		marginTop: 20,
		marginBottom: 10,
		paddingHorizontal: 10,
		height: 40,

		borderBottomWidth: 1,
		borderColor: 'gray',
	},
	contentInput: {
		paddingHorizontal: 10,
		textAlignVertical: 'top',
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
	},
	photoUpload: {
		alignItems: 'center',
	},
	bgImage: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		borderRadius: 15,
		zIndex: -10,
		position: 'absolute',
	},
});
