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
	const rotateValue = useRef(new Animated.Value(0)).current; // 초기 값 0
	const [inputValue, setInputValue] = useState('');
	const [familyNickname, setFamilyNickname] = useState(''); // 닉네임 상태 관리

	const rotateAnimation = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-15deg', '0deg'],
	});

	const handleButtonPress = () => {
		// 버튼을 눌렀을 때 nickname 값을 변수에 저장하는 로직
		let savedNickname = familyNickname;
		console.log('저장된 닉네임:', savedNickname);
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
				<View style={styles.conditionalContent}>
					<Text style={styles.familyText}>가족 닉네임 만들기</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.inputNickname}
							placeholder="닉네임을 설정하세요"
							onChangeText={(text) => setFamilyNickname(text)}
							value={familyNickname}
						/>
						<TouchableOpacity
							style={[
								styles.button,
								!familyNickname ? styles.buttonDisabled : styles.buttonEnabled,
							]}
							onPress={handleButtonPress}
							disabled={!familyNickname}
						>
							<Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
						</TouchableOpacity>
					</View>
				</View>

                {/* 여기에 상태메시지 만들기 용 View 들어가야됨 */}
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
	inputNickname: {
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
