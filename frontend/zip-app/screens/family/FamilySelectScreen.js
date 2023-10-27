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

export default function FamilySelectScreen({ navigation }) {
	const [familyList, setFamilyList] = useState(null);
	const rotateValue = useRef(new Animated.Value(0)).current; // 초기 값 0

	const rotateAnimation = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-15deg', '0deg'],
	});

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

	useEffect(() => {
		async function fetchData() {
			axiosInstance.get(`/family/list`).then((response) => {
				setFamilyList(response.data.familyList);
				console.log(response.data);
			});
		}

		fetchData();
	}, []);

	return (
		<View style={styles.container}>
			<Animated.Text
				style={{ ...styles.logo, transform: [{ rotate: rotateAnimation }] }}
			>
				zip
			</Animated.Text>

			<View style={styles.conditionalContent}>
				{familyList && familyList.length > 0 ? (
					// familyList가 있는 경우
					<FlatList
						data={familyList}
						renderItem={({ item }) => (
							<TouchableOpacity>
								<Text style={styles.familyText}>{item.familyName}</Text>
							</TouchableOpacity>
						)}
					/>
				) : (
					// familyList가 비어있는 경우
					<>
						<Text style={styles.familyText}>가족 만들기</Text>
					</>
				)}

				<TouchableOpacity>
					<Text style={styles.plusButton}>+</Text>
				</TouchableOpacity>
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
		transform: [{ rotate: '-15deg' }], // 이 부분을 추가합니다.
	},
	conditionalContent: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 200,
	},
	familyText: {
		fontSize: 30,
		fontWeight: 'bold',
		marginTop: 20,
	},
	plusButton: {
		fontSize: 30,
		marginTop: 20,
		color: 'gray',
	},
});
