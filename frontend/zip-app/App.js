// Android 또는 iOS용으로 빌드하는 경우 프로덕션 단계에서 앱이 중단될 수 있기 때문에 무조건 넣어줘야함.
import 'react-native-gesture-handler';

// 화면이동
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import StackNavigator from './screens/navigation/StackNavigator';

// 화면 배경색 변경
const navTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'white',
	},
};

export default function App() {
	return (
		<NavigationContainer theme={navTheme}>
			<StackNavigator />
		</NavigationContainer>
	);
}
