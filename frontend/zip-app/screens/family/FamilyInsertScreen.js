import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	Animated,
	TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../util/Interceptor';
import { TextInput } from 'react-native-gesture-handler';

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

	const handleNicknameButtonPress = () => {
		console.log('저장된 닉네임:', nickName);

		const formData = new FormData();

		// 객체를 문자열로 변환하여 추가
		formData.append(
			'familyRegisterRequest',
			JSON.stringify({
				name: familyName,
				content: familyMessage,
				nickname: nickName,
			}),
		);

		// file이 있는 경우에만 추가
		// if (file) {
		// 	formData.append('file', file);
		// }

        formData.append('file', null);

		// axios 요청에 Content-Type을 multipart/form-data로 설정
		axiosInstance
			.post('/family/register', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((response) => {
				console.log('저장된 가족의 ID : ', response.data.id);
				AsyncStorage.setItem('familyId', JSON.stringify(response.data.id));
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
				) : (
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
