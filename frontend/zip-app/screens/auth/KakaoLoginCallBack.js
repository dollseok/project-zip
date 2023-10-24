import { StyleSheet, View, Text, Button } from 'react-native';

export default function KakaoLoginCallBack({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>카카오 로그인 중..</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 50,
	},
});
