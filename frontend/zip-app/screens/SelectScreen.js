import { View, Text, Button } from 'react-native';

export default function SelectScreen({ navigation }) {
	return (
		<View>
			<Text>가족 선택 화면</Text>
			<Text>가족 생성</Text>
			<Text>가족 등록</Text>
			<Button
				title="가족 페이지로 이동"
				onPress={() => navigation.navigate('홈')}
			/>
		</View>
	);
}
