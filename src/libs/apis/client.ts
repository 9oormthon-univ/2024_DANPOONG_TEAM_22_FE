import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { handleLogout } from '@utils/handleLogout';

const client = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 모든 요청 전에 토큰을 헤더에 추가
client.interceptors.request.use(async config => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 로그 출력
    console.log(
      'Request:',
      JSON.stringify(
        {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data,
        },
        null,
        2,
      ),
    );

    return config;
  } catch (error) {
    console.log('토큰 가져오기 실패:', error);
    return config;
  }
});

// Response Interceptor: API 응답 처리 및 에러 핸들링
client.interceptors.response.use(
  response => {
    // 응답 로그 출력
    console.log(
      'Response:',
      JSON.stringify(
        {
          url: response.config.url,
          status: response.status,
          data: response.data,
        },
        null,
        2,
      ),
    );
    return response;
  },
  async error => {
    if (error.response) {
      // 응답 에러 로그 출력
      console.log(
        'Response Error:',
        JSON.stringify(
          {
            url: error.config.url,
            status: error.response.status,
            data: error.response.data,
          },
          null,
          2,
        ),
      );

      switch (error.response.status) {
        case 401:
        case 403:
          try {
            // 1. refreshToken 확인
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('[401] 로그인이 필요합니다.');
            }
            
            // 2. 새로운 accessToken 요청
            const response = await axios.post(
              `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/token/refresh`,
              { refreshToken }
            );
            const accessToken = response.data.result.accessToken;
            
            // 3. 새 accessToken 저장
            await AsyncStorage.setItem('accessToken', accessToken);
            
            // 4. 실패했던 원래 요청 재시도
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // 5. 토큰 갱신 실패 시
            await handleLogout();
            const errorMessage = error.response.status === 401
              ? '[401] 인증이 만료되었습니다. 다시 로그인해주세요.'
              : '[403] 접근 권한이 없습니다. 다시 로그인해주세요.';
            throw new Error(errorMessage);
          }
        case 404:
          throw new Error('[404] 요청한 리소스를 찾을 수 없습니다.');
        case 500:
          throw new Error('[500] 서버 오류가 발생했습니다.');
        default:
          throw new Error(
            `[${error.response.status}] 알 수 없는 오류가 발생했습니다.`,
          );
      }
    } else if (error.request) {
      // 네트워크 오류 처리
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      throw error;
    }
  },
);



export default client;
