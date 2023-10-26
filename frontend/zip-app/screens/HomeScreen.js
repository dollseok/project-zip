import { StyleSheet, Text, View, Button } from 'react-native';

// 아이콘
import Ionicons from 'react-native-vector-icons/Ionicons';

// 화면 이동
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MypageScreen from './MypageScreen';
import CalendarScreen from './CalendarScreen';
import ScheduleScreen from './ScheduleScreen';
import DiaryScreen from './diary/DiaryScreen';
import AlbumScreen from './album/AlbumScreen';
import FamilyMainScreen from './FamilyMainScreen';

const Tab = createBottomTabNavigator();

function CalendarStack() {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="calendar"
				component={CalendarScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="일정"
				component={ScheduleScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

const tabBarStyle = {
	backgroundColor: 'black',
};

export default function HomeScreen() {
	return (
		<Tab.Navigator
			initialRouteName="메인"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === '일기') {
						iconName = 'paper-plane';
					} else if (route.name === '앨범') {
						iconName = 'images';
					} else if (route.name === '캘린더') {
						iconName = 'calendar-outline';
					} else if (route.name === '마이페이지') {
						iconName = 'ios-person-circle-outline';
					} else if (route.name === '메인') {
						iconName = 'home';
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				style: tabBarStyle,
			})}
		>
			<Tab.Screen
				name="일기"
				component={DiaryScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="앨범"
				component={AlbumScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="메인"
				component={FamilyMainScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="캘린더"
				component={CalendarStack}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="마이페이지"
				component={MypageScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
