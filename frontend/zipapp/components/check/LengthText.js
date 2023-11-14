import {Alert} from 'react-native';

export async function lengthText(text, purpose) {
  if (purpose == 'FamilyName') {
    // 가족 이름
    if (text.length > 6) {
      Alert.alert('경고!', '너무 긴 가족 이름입니다!! (6자 이하)');
      return false;
    } else {
      return true;
    }
  } else if (purpose == 'FamilyContent') {
    // 가족 메시지
    if (text.length > 10) {
      Alert.alert('경고!', '너무 긴 가족 메시지입니다!! (10자 이하)');
      return false;
    } else {
      return true;
    }
  } else if (purpose == 'Nickname') {
    // 유저 닉네임
    if (text.length > 5) {
      Alert.alert('경고!', '너무 긴 닉네임입니다!! (5자 이하)');
      return false;
    } else {
      return true;
    }
  }
}
