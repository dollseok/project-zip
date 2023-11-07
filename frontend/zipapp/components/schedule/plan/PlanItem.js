import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../../util/Interceptor';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlanItem(props) {
	const plan = props.plan;
	const [manager, setManager] = useState('');

	// 멤버 id로 담당자 닉네임 가져오기
	const getManagerNickname = async (managerId) => {
		const familyId = await AsyncStorage.getItem('familyId');

		axiosInstance
			.get(`/family/member`, {
				params: {
					familyId: familyId,
				},
			})
			.then((res) => {
				const familyMembers = res.data.data.familyMemberDetailResponseDtoList;
				familyMembers.map((item) => {
					if (item.memberId === managerId) {
						setManager(item.nickname);
						return;
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deletePlan = (planId) => {
		axiosInstance
			.delete(`/plan/delete`, {
				data: {
					planId: planId,
				},
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getManagerNickname(plan.memberId);
	});

	return (
		<View style={styles.eachPlan}>
			<TouchableOpacity style={styles.planCheckbox}>
				<Ionicons
					name="checkbox-outline"
					size={24}
					color={plan.statusCode === 0 ? 'grey' : 'black'}
				/>
			</TouchableOpacity>
			<View style={styles.planTitle}>
				<Text>{plan.title}</Text>
			</View>
			<View style={styles.planManager}>
				<Text>{manager}</Text>
			</View>
			<TouchableOpacity onPress={() => deletePlan(plan.planId)}>
				<Text style={{ color: 'tomato' }}>삭제</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	eachPlan: {
		flexDirection: 'row',
		gap: 5,
	},
	planCheckbox: {
		width: '10%',
	},
	planTitle: {
		width: '50%',
	},
	planManager: {
		width: '20%',
	},
});
