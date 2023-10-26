import axios from "axios";

const axiosInstance = Axios.create({
    baseURL: 'http://10.0.2.2:8080/api',
    timeout: 1000,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        config.headers["Content-Type"] = "application/json; charset=utf-8";
        config.headers["Authorization"] = accessToken;
        return config;
    },
    (error) => {
		console.error(error);
		return Promise.reject(error);
	},
)

axiosInstance.interceptors.response.use(
	(response) => {
		console.log("response", response);
		return response;
	},
	async (error) => {
		if (error.response.status === 400) {
			alert(
				"세션이 만료되었습니다. 해당 서비스는 재 로그인 이후 이용 가능합니다.",
			);
			return "session expire";
		}

		if (error.response.status === 500) {
			Sentry.captureMessage("서버 에러");
			alert("시스템 에러, 관리자에게 문의 바랍니다.");
		}

		console.error(error);
	},
);


export default axiosInstance;