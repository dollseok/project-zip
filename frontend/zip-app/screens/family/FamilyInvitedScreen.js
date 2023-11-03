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

export default function FamilyInvitedScreen({ navigation }) {
	const rotateValue = useRef(new Animated.Value(0)).current;
    const [familyCode, setFamilyCode] = useState('');
	const [nickName, setNickname] = useState('');
    const [isfamilyCodeViewVisible, setfamilyCodeViewVisible] = useState(true);

	const rotateAnimation = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-15deg', '0deg'],
	});

    const handleFamilyCodeButtonPress = () => {
		setfamilyCodeViewVisible(false);
		console.log('저장된 가족 코드:', familyCode);
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
});
