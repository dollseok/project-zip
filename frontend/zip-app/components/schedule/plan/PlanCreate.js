import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function PlanCreate() {
	// 계획 등록에 필요한 데이터
	// 일정 id
	const [planTitle, setPlanTitle] = useState(''); // 계획 제목

	return (
		<View style={styles.planCreateContainer}>
			<View style={styles.planCheckbox}>
				<Ionicons name="checkbox-outline" size={24} color="black" />
			</View>
			<View style={styles.planTitle}>
				<TextInput
					style={styles.planTitleInput}
					placeholder="할 일 등록하기"
					onChange={(text) => {
						setPlanTitle(text);
					}}
				/>
			</View>
			<View style={styles.planManager}>
				<Text>담당자</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	planCreateContainer: {
		flexDirection: 'row',
		gap: 5,
		opacity: 0.5,
	},
	planCheckbox: {
		width: '10%',
	},
	planTitle: {
		width: '50%',
	},
	planTitleInput: {
		borderBottomWidth: 1,
		bordorColor: 'gray',
	},
	planManager: {
		width: '20%',
	},
});
