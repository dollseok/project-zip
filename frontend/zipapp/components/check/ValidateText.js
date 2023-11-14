import { Alert } from 'react-native';

export async function validateText(text) {
  // 한글과 공백만 허용하는 정규식
  const regex = /^[가-힣\s]*$/;

  if (regex.test(text)) {
    return true;
  } else {
    Alert.alert('경고!', '올바르지 않은 문자열입니다!');
    return false;
  }
}
