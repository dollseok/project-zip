import {StyleSheet, Text, View, Button} from 'react-native';

// 아이콘
import Ionicons from 'react-native-vector-icons/Ionicons';

// 화면 이동
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="일정"
        component={ScheduleScreen}
        options={{headerShown: false}}
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
      screenOptions={({route}) => ({
        tabBarShowLabel: false, // 아이콘 별 이름 안보이게
        tabBarStyle: {
          backgroundColor: 'white', // 하단 탭 배경색상
          height: '10%', // 하단 탭 높이
          borderColor: 'white', // 경계선 안보이게
        },
        tabBarActiveTintColor: 'black', // 탭 활성화 아이콘 색상
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.15)', // 탭 비활성화 아이콘 색상
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === '일기') {
            iconName = 'paper-plane';
          } else if (route.name === '앨범') {
            iconName = 'images';
          } else if (route.name === '캘린더') {
            iconName = 'calendar-outline';
          } else if (route.name === '마이페이지') {
            iconName = 'person-circle-outline';
          } else if (route.name === '메인') {
            iconName = 'home';
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}>
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
        // initialParams={{ familyId: route.params.familyId }}
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
