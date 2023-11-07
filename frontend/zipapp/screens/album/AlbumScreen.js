import { StyleSheet, Text, View } from 'react-native';

export default function AlbumScreen() {
	return (
		<View style={styles.container}>
			<Text>앨범 화면</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
