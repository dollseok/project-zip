import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosFileInstance = Axios.create({
  // baseURL: 'http://localhost:9090/api',
  // baseURL: 'http://10.0.2.2:9090/api',
  baseURL: 'https://lastdance.kr/api',
  // timeout: 5000,
});

axiosFileInstance.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers['Authorization'] = accessToken;
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

axiosFileInstance.interceptors.response.use(
  response => {
    // console.log("response");
    return response;
  },

  async error => {
    const {config} = error;
    if (error.response && error.response.status === 401) {
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
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // window.location.href = ("/");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosFileInstance;
