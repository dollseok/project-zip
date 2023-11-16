import { Alert } from 'react-native';

export async function validateText(text) {
  // 한글, 공백, 영어 문자 허용하는 정규식
  const regex = /^[가-힣\sA-Za-z]*$/;

  if (regex.test(text)) {
    return true;
  } else {
    Alert.alert('경고!', '올바르지 않은 문자열입니다!');
    return false;
  }
}
