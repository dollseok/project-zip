import { StyleSheet, Text, View } from 'react-native';

export default function FamilyMainScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.family}>
				<Text>가족 메인 화면</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	family: {
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
		width: 300,
		height: 400,
	},
});
