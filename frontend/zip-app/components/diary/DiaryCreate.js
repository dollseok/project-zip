import { useRef, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
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
import * as ImagePicker from 'expo-image-picker';

export default function DiaryCreate(props) {
	const { createModalVisible, setCreateModalVisible } = props;
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
		}
		// 이미지 업로드 결과 및 이미지 경로 업데이트
		console.log(result);
		setImageUrl(result.assets);

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
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.background} />
				</TouchableWithoutFeedback>
				<Animated.View
					style={{
						...styles.bottomSheetContainer,
						transform: [{ translateY: translateY }],
					}}
					{...panResponders.panHandlers}
				>
					<View style={styles.createFormContainer}>
						{/* 취소 & 등록 버튼 */}
						<View style={styles.buttonContainer}>
							{/* 취소 버튼 */}
							<View style={styles.cancelButton}>
								<Text>취소</Text>
							</View>
							{/* 등록 버튼 */}
							<View style={styles.writeButton}>
								<Text>완료</Text>
							</View>
						</View>
						{/* 일자 및 감정 선택 */}
						<View style={styles.dayEmotionContainer}>
							<View style={styles.emptyContainer}></View>
							<View style={styles.dayContainer}>
								<Text>일자 선택</Text>
							</View>
							<View style={styles.emotionContainer}>
								<Text>감정 선택</Text>
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
				</Animated.View>
				<TouchableWithoutFeedback onPress={closeModal}>
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
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 20,
		marginHorizontal: 15,
		marginBottom: 15,
		padding: 20,
	},
	createFormContainer: {
		padding: 10,
		gap: 30,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dayEmotionContainer: {
		flexDirection: 'row',
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		opacity: 0,
	},
	dayContainer: {
		flex: 1,
		alignItems: 'center',
	},
	emotionContainer: {
		flex: 1,
		alignItems: 'center',
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
});
