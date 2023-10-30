import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function PickYearMonth() {
	const [selectedY, setSelectedY] = useState(new Date().getFullYear()); // 초기 년도 설정
	const [selectedM, setSelectedM] = useState(new Date().getMonth() + 1); // 초기 월 설정 (1은 1월을 의미)

	const handleYearChange = (year) => {
		setSelectedY(year);
	};

	const handleMonthChange = (month) => {
		setSelectedM(month);
	};

	return (
		<View style={styles.dateContainer}>
			{/* 연도 선택 */}
			<View style={styles.selectYear}>
				<Picker
					itemStyle={{ fontSize: 24 }}
					selectedValue={selectedY}
					onValueChange={handleYearChange}
				>
					<Picker.item label="2020" value={2020} />
					<Picker.item label="2021" value={2021} />
					<Picker.item label="2022" value={2022} />
					<Picker.item label="2023" value={2023} />
					<Picker.item label="2024" value={2024} />
				</Picker>
			</View>
			{/* 월 선택 */}
			<View style={styles.selectMonth}>
				<Picker
					style={{ fontSize: 40 }}
					selectedValue={selectedM}
					onValueChange={handleMonthChange}
				>
					<Picker.Item label="1" value={1} />
					<Picker.Item label="2" value={2} />
					<Picker.Item label="3" value={3} />
					<Picker.Item label="4" value={4} />
					<Picker.Item label="5" value={5} />
					<Picker.Item label="6" value={6} />
					<Picker.Item label="7" value={7} />
					<Picker.Item label="8" value={8} />
					<Picker.Item label="9" value={9} />
					<Picker.Item label="10" value={10} />
					<Picker.Item label="11" value={11} />
					<Picker.Item label="12" value={12} />
				</Picker>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	dateContainer: {
		gap: 20,
		marginTop: 20,
		marginBottom: 20,
		width: '40%',
	},
	selectYear: {
		borderWidth: 1,
		borderColor: 'black',
	},
	selectMonth: {
		borderWidth: 1,
		borderColor: 'black',
	},
});
