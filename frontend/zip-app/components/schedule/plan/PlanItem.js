import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlanItem(props) {
	const plan = props.plan;

	return (
		<View style={styles.eachPlan}>
			<View style={styles.planCheckbox}>
				<Ionicons name="checkbox-outline" size={24} color="black" />
			</View>
			<View style={styles.planTitle}>
				<Text>{plan.title}</Text>
			</View>
			<View style={styles.planManager}>
				<Text>담당자</Text>
			</View>
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
