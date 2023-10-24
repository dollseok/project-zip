import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../HomeScreen';
import IntroScreen from '../IntroScreen';
import LoginScreen from '../auth/LoginScreen';
import SelectScreen from '../SelectScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
	return (
		<Stack.Navigator initialRouteName="진입화면">
			<Stack.Screen
				name="홈"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="진입화면"
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="로그인"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="가족선택"
				component={SelectScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}
