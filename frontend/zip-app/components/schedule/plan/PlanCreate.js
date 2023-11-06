import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import axiosInstance from '../../../util/Interceptor';

export default function PlanCreate(props) {
	const [isCreating, SetIsCreating] = useState(false);
	// 계획 등록에 필요한 데이터
	const { scheduleId } = props; // 일정 id
	const [planTitle, setPlanTitle] = useState(''); // 계획 제목

	const createPlan = () => {
		console.log('일정 id: ', scheduleId);
		console.log('계획 제목: ', planTitle);
		axiosInstance
			.post(`/plan/write`, {
				scheduleId: scheduleId,
				title: planTitle,
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<View style={styles.planCreateContainer}>
			{isCreating ? (
				<>
					<View style={styles.planCheckbox}>
						<Ionicons name="checkbox-outline" size={24} color="black" />
					</View>
					<View style={styles.planTitle}>
						<TextInput
							style={styles.planTitleInput}
							placeholder="할 일 등록하기"
							onChangeText={(text) => {
								setPlanTitle(text);
							}}
						/>
					</View>
					<View style={styles.planManager}>
						<Text>담당자</Text>
					</View>
					<TouchableOpacity
						onPress={async () => {
							await createPlan();
							SetIsCreating(false);
						}}
					>
						<Text>등록</Text>
					</TouchableOpacity>
				</>
			) : (
				<TouchableOpacity
					style={styles.addPlanContainer}
					onPress={() => SetIsCreating(true)}
				>
					<AntDesign name="plus" size={20} color="black" />
					<Text>할 일 추가하기</Text>
				</TouchableOpacity>
			)}
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
		borderColor: 'gray',
	},
	planManager: {
		width: '20%',
	},
	addPlanContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 5,
	},
});
