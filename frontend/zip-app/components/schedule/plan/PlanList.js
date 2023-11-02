import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PlanItem from './PlanItem';
import PlanCreate from './PlanCreate';

export default function PlanList(props) {
	const plans = props.plan;

	return (
		<View style={styles.planContainer}>
			<View style={styles.planHeader}>
				<View style={styles.planSubTitle}>
					<Text>할 일</Text>
				</View>
				<TouchableOpacity style={styles.addBtnContainer}>
					<AntDesign name="plus" size={20} color="black" />
				</TouchableOpacity>
			</View>
			<View style={styles.planList}>
				<PlanCreate />
				{plans ? (
					<FlatList
						data={plans}
						keyExtractor={(item) => item.planId.toString()}
						renderItem={({ item }) => <PlanItem plan={item} />}
					/>
				) : (
					<View>
						<Text>아직 등록된 할 일이 없습니다.</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	// 계획 전체
	planContainer: {},
	// 소제목과 등록 버튼
	planHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});
