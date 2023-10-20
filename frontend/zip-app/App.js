// Android 또는 iOS용으로 빌드하는 경우 프로덕션 단계에서 앱이 중단될 수 있기 때문에 무조건 넣어줘야함.
import 'react-native-gesture-handler';

// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// 화면이동
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/HomeScreen'
import CalendarScreen from './pages/CalendarScreen'
import ScheduleScreen from './pages/ScheduleScreen'
import DiaryScreen from './pages/DiaryScreen'
import MypageScreen from './pages/MypageScreen'


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="홈" component={HomeScreen} />
        <Stack.Screen name="캘린더" component={CalendarScreen} />
        <Stack.Screen name="일정" component={ScheduleScreen} />
        <Stack.Screen name="일기" component={DiaryScreen} />
        <Stack.Screen name="프로필" component={MypageScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
