import { StyleSheet, View, Text, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>로그인 화면</Text>
			<Button
				title="카카오로 로그인하기"
				onPress={() => navigation.navigate('가족선택')}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 50,
	},
});
