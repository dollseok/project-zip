import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const axiosInstance = Axios.create({
  // baseURL: 'http://10.0.2.2:9090/api',
  // baseURL: 'http://localhost:9090/api',
  baseURL: 'https://lastdance.kr/api',
  // timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    config.headers['Authorization'] = accessToken;
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },

  async error => {
    const {config} = error;
    if (error.response.status === 401) {
      const originRequest = config;
      try {
        const response = await postRefreshToken();
        const newAccessToken = response.headers['authorization'];
        // console.log(newAccessToken, "newAccessToken");
        await AsyncStorage.setItem(
          'accessToken',
          response.headers['authorization'],
        );
        await AsyncStorage.setItem(
          'refreshToken',
          response.headers['authorization-refresh'],
        );
        Axios.defaults.headers.common.Authorization = newAccessToken;
        originRequest.headers.Authorization = newAccessToken;
        // console.log("토큰 재발급 완료");
        return axios(originRequest);
      } catch {
        console.log('catch 에러');
        const navigation = useNavigation();
        await AsyncStorage.clear();
        navigation.navigate('진입화면');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
