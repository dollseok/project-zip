import { Text, View, Button } from 'react-native';

export default function IntroScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>진입 화면</Text>
			<Button
				title="로그인 이동"
				onPress={() => navigation.navigate('로그인')}
			/>
		</View>
	);
}
