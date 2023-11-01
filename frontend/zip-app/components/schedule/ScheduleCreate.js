import { useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Modal,
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	PanResponder,
} from 'react-native';

export default function ScheduleCreate(props) {
	const { createModalVisible, setCreateModalVisible } = props;
	const screenHeight = Dimensions.get('screen').height;
	const panY = useRef(new Animated.Value(screenHeight)).current;
	const translateY = panY.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	});

	const resetScheduleCreate = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	});

	const closeScheduleCreate = Animated.timing(panY, {
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
					resetScheduleCreate.start();
				}
			},
		}),
	).current;

	useEffect(() => {
		if (props.createModalVisible) {
			resetScheduleCreate.start();
		} else {
			closeScheduleCreate.start();
		}
	}, [props.createModalVisible]);

	const closeModal = () => {
		closeScheduleCreate.start(() => {
			setCreateModalVisible(false);
		});
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
						<View style={styles.buttonContainer}>
							<Text>취소</Text>
							<Text>완료</Text>
						</View>
						<View style={styles.contentContainer}>
							<Text>제목 인풋</Text>
							<Text>위치 인풋</Text>
							<View style={styles.selectDate}>
								<View style={styles.selectStartDate}>
									<Text>시작일 라벨</Text>
									<Text>2023.09.18</Text>
								</View>
								<View style={styles.selectEndDate}>
									<Text>종료일 라벨</Text>
									<Text>2023.09.18</Text>
								</View>
							</View>
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
		justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 20,
		marginHorizontal: 15,
		marginBottom: 15,
		padding: 20,
	},
	previewHeader: {
		flexDirection: 'row',
		width: '100%',
		height: 60,
		borderColor: 'black',
		borderWidth: 1,
	},
	// 일정 날짜 텍스트
	previewDateFont: {
		fontSize: 50,
		fontWeight: 'bold',
		textAlignVertical: 'bottom',
	},
	// 날짜 단위 텍스트
	dateUnitFont: {
		fontSize: 30,
		fontWeight: 'bold',
		textAlignVertical: 'bottom',
	},
	contentTitleFont: {
		fontSize: 24,
	},
});
