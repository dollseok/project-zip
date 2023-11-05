import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	Animated,
	TouchableOpacity,
	Image,
	Modal,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../util/Interceptor';
import axiosFileInstance from '../../util/FileInterceptor';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

export default function FamilyInvitedScreen({ navigation }) {
	const rotateValue = useRef(new Animated.Value(0)).current;
	const [familyCode, setFamilyCode] = useState('');
	const [nickName, setNickname] = useState('');
	const [familyCodeViewVisible, setfamilyCodeViewVisible] = useState(true);
	const [isModalVisible, setModalVisible] = useState(false);

	const rotateAnimation = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-15deg', '0deg'],
	});

	// 모달을 닫는 함수
	const toggleModal = () => {
		setFamilyCode('');
		setModalVisible(!isModalVisible);
	};

	const handleFamilyCodeButtonPress = () => {
		console.log('저장된 가족 코드:', familyCode);
		const familyCheckCodeRequestDto = { familyCode: familyCode };
		axiosInstance
			.post('/family/check', familyCheckCodeRequestDto)
			.then((response) => {
				if (response.data.data.result == true) {
					// 뒤로 넘어가기
					setfamilyCodeViewVisible(false);
				} else {
					// 모달 창을 표시합니다.
					toggleModal();
				}
			})
			.catch((error) => {
				console.error('가족 코드 조회 에러: ', error);
			});
	};

	const handleNicknameButtonPress = async () => {
		console.log('저장된 닉네임:', nickName);

		const familyRegisterAcceptRequest = {
			familyCode: familyCode,
			nickname: nickName
		};

		axiosInstance
			.post('/family/accept', familyRegisterAcceptRequest)
			.then((response) => {
				AsyncStorage.setItem('familyId', JSON.stringify(response.data.data.familyId));
				console.log("가족 초대 수락 후 응답 데이터 : ", response.data.data);
				navigation.navigate('홈');
			})
			.catch((error) => {
				console.error('가족 초대 수락 에러: ', error);
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
			<View style={styles.conditionalContent}>
				{familyCodeViewVisible ? (
					<View>
						<Text style={styles.familyText}>초대장을 받으셨나요?</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputText}
								placeholder="초대 코드를 입력하세요"
								onChangeText={(text) => setFamilyCode(text)}
								value={familyCode}
							/>
							<TouchableOpacity
								style={[
									styles.button,
									!familyCode ? styles.buttonDisabled : styles.buttonEnabled,
								]}
								onPress={handleFamilyCodeButtonPress}
								disabled={!familyCode}
							>
								<Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View>
						<Text style={styles.familyText}>닉네임 만들기</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.inputText}
								placeholder="닉네임을 입력하세요"
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
				)}
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={toggleModal} // 안드로이드에서 뒤로가기 버튼을 눌렀을 때 모달을 닫기 위한 처리
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>
							이미 가입되어 있거나, 없는 가족 코드입니다.
						</Text>
						<Button title="확인" onPress={toggleModal} />
					</View>
				</View>
			</Modal>
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
	imageContainer: {
		flexDirection: 'column',
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
	// 모달과 관련된 스타일들
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});
