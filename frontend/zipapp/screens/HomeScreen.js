import {StyleSheet, Text, View, Button, Dimensions} from 'react-native';
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
import {useEffect} from 'react';

const Tab = createBottomTabNavigator();

// const {width, height} = Dimensions.get('window');

function CalendarStack({route, navigation}) {
  const Stack = createStackNavigator();

  let dateInfo = '';
  if (route.params) {
    dateInfo = route.params.dateInfo;
  }
  console.log('앨범에서 선택한 사진의 날짜 정보: ', dateInfo);

  useEffect(() => {
    if (dateInfo) {
      navigation.navigate('일정', {
        dateInfo: dateInfo,
      });
    }
  }, [dateInfo, navigation]);

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

export default function HomeScreen() {
  return (
    // <View style={{width, height}}>
    <Tab.Navigator
      initialRouteName="메인"
      screenOptions={({route}) => ({
        tabBarShowLabel: false, // 아이콘 별 이름 안보이게
        tabBarStyle: {
          backgroundColor: 'transparent', // 하단 탭 배경색상
          height: 90, // 하단 탭 높이
          borderTopWidth: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
        },
        tabBarActiveTintColor:
          route.name === '메인' || route.name === '마이페이지'
            ? 'white'
            : 'black', // 탭 활성화 아이콘 색상
        tabBarInactiveTintColor:
          route.name === '메인' || route.name === '마이페이지'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.15)', // 탭 비활성화 아이콘 색상
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === '일기') {
            iconName = 'paper-plane-sharp';
          } else if (route.name === '앨범') {
            iconName = 'images-outline';
          } else if (route.name === '캘린더') {
            iconName = 'calendar-outline';
          } else if (route.name === '마이페이지') {
            iconName = 'person-circle-outline';
          } else if (route.name === '메인') {
            iconName = 'home-outline';
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
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
