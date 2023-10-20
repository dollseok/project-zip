import { StyleSheet, Text, View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>홈 화면</Text>
      {/* <Button
        title="달력으로 이동"
        onPress={() => navigation.navigate('캘린더') }
      />
      <Button
        title="일정으로 이동"
        onPress={() => navigation.navigate('일정') }
      />
      <Button
        title="일기로 이동"
        onPress={() => navigation.navigate('일기') }
      />
      <Button
        title="프로필로 이동"
        onPress={() => navigation.navigate('프로필') }
      /> */}
    </View>
  );
}