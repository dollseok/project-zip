import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	Animated,
	TouchableOpacity,
	Image,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosFileInstance from '../../util/FileInterceptor';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

export default function FamilyInsertScreen({ navigation }) {
	const rotateValue = useRef(new Animated.Value(0)).current;
	const [familyName, setFamilyName] = useState('');
	const [familyMessage, setFamilyMessage] = useState('');
	const [nickName, setNickname] = useState('');

	const [isfamilyNameViewVisible, setfamilyNameViewVisible] = useState(true);
	const [isMessageViewVisible, setMessageViewVisible] = useState(true);
	const [isNicknameViewVisible, setNicknameViewVisible] = useState(true);

	const rotateAnimation = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-15deg', '0deg'],
	});

	const handleFamilyNameButtonPress = () => {
		setfamilyNameViewVisible(false);
		console.log('저장된 가족 이름:', familyName);
	};

	const handleMessageButtonPress = () => {
		setMessageViewVisible(false);
		console.log('저장된 메시지:', familyMessage);
	};

	const handleNicknameButtonPress = async () => {
		setNicknameViewVisible(false);
		console.log('저장된 닉네임:', nickName);
	};

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

		console.log('선택한 이미지 URI : ', result.uri);
		console.log('선택한 이미지 데이터 타입 : ', typeof result);
		console.log('선택한 이미지 데이터 구조 : ', JSON.stringify(result, null, 2));
		// cancelled가 아닐 때 가져온 사진의 주소로 onChangePhoto
		if (!result.cancelled) {
			await _uploadImage(result.uri);
		} else {
			return null;
		}
	};

	const _uploadImage = async (uri) => {

		const response = await fetch(uri);
		const file = await response.blob();
		console.log("파일 : ", file._data);

		const formData = new FormData();

		const familyRegisterRequest = {
			name: familyName,
			content: familyMessage,
			nickname: nickName
		};

		// const segments = uri.split('/'); // '/' 문자를 기준으로 URI를 분할
		// const fileName = segments[segments.length - 1]; // 배열의 마지막 요소가 파일 이름
		
		formData.append('familyRegisterRequest', JSON.stringify(familyRegisterRequest));
		formData.append('file', file._data);

		await axiosFileInstance
			.post('/family/register', formData)
			.then((response) => {
				console.log(response.data);
				console.log('저장된 가족의 ID : ', response.data.data.id);
				AsyncStorage.setItem('familyId', JSON.stringify(response.data.data.id));
				navigation.navigate('홈');
			})
			.catch((error) => {
				console.error('가족 등록 에러: ', error);
			});
	};


	useEffect(() => {
		const animate = () => {
			// -15도에서 0도로
			Animated.timing(rotateValue, {
				toValue: 1,
				duration: 1000, // 1초
				useNativeDriver: true,
			}).start(() => {
				// 0도에서 -15도로
				Animated.timing(rotateValue, {
					toValue: 0,
					duration: 1000, // 1초
					useNativeDriver: true,
				}).start(animate); // 애니메이션 끝날 때마다 재시작
			});
		};

		animate(); // 애니메이션 시작

		return () => {
			rotateValue.stopAnimation(); // 컴포넌트 unmount 시 애니메이션 중지
		};
	}, []);

	return (
		<View style={styles.container}>
			<Animated.Text
				style={{ ...styles.logo, transform: [{ rotate: rotateAnimation }] }}
			>
				zip
			</Animated.Text>
			<View>
				{isfamilyNameViewVisible ? (
					<View style={styles.conditionalContent}>
						<Text style={styles.familyText}>가족 이름 만들기</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputText}
								placeholder="가족 이름을 설정하세요"
								onChangeText={(text) => setFamilyName(text)}
								value={familyName}
							/>
							<TouchableOpacity
								style={[
									styles.button,
									!familyName ? styles.buttonDisabled : styles.buttonEnabled,
								]}
								onPress={handleFamilyNameButtonPress}
								disabled={!familyName}
							>
								<Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : isMessageViewVisible ? (
					<View style={styles.conditionalContent}>
						<Text style={styles.familyText}>상태메시지 만들기</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputText}
								placeholder="상태메시지를 설정하세요"
								onChangeText={(text) => setFamilyMessage(text)}
								value={familyMessage}
							/>
							<TouchableOpacity
								style={[
									styles.button,
									!familyMessage ? styles.buttonDisabled : styles.buttonEnabled,
								]}
								onPress={handleMessageButtonPress}
								disabled={!familyMessage}
							>
								<Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : isNicknameViewVisible ? (
					// 닉네임 입력 View
					<View style={styles.conditionalContent}>
						<Text style={styles.familyText}>닉네임 만들기</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputText}
								placeholder="닉네임을 설정하세요"
								onChangeText={(text) => setNickname(text)}
								value={nickName}
							/>
							<TouchableOpacity
								style={[
									styles.button,
									!nickName ? styles.buttonDisabled : styles.buttonEnabled,
								]}
								onPress={handleNicknameButtonPress}
								disabled={!nickName}
							>
								<Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View style={styles.conditionalContent}>
						<Text style={styles.familyText}>배경사진 업로드</Text>
						<View style={styles.inputContainer}>
							<TouchableOpacity
								onPress={_handlePhotoBtnPress}
								disabled={!nickName}
							>
								<Image
									source={require('../../assets/gallery.png')}
									style={{
										width: 100,
										height: 100,
										backgroundColor: 'white',
									}}
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	logo: {
		fontSize: 50,
		fontWeight: 'bold',
		position: 'absolute',
		top: 40,
		alignSelf: 'center',
		transform: [{ rotate: '-15deg' }],
	},
	conditionalContent: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 150,
	},
	familyText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
	},
	inputText: {
		borderBottomWidth: 1,
		width: 180,
	},
	button: {
		padding: 5,
		marginLeft: 10,
		borderRadius: 5, // 버튼 모서리 둥글게
	},
	buttonDisabled: {
		backgroundColor: 'gray',
	},
	buttonEnabled: {
		backgroundColor: 'black',
	},
});
