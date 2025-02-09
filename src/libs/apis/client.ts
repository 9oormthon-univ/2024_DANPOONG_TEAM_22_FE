import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

// navigation 인스턴스를 저장할 변수
let navigationRef: any = null;

// navigation 참조를 설정하는 함수
export const setNavigator = (nav: any) => {
  navigationRef = nav;
};

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
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

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
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async error => {
    if (error.response) {
      // 응답 에러 로그 출력
      console.log('Response Error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data,
      });

      switch (error.response.status) {
        case 401:
        case 403:
          // 인증 에러 처리
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            // refreshToken이 없으면 바로 로그아웃 처리
            if (!refreshToken) {
              await handleLogout();
              throw new Error('[401] 로그인이 필요합니다.');
            }
            
            const response = await axios.post(
              `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/token/refresh`,
              { refreshToken }
            );
            const accessToken = response.data.result.accessToken;
            await AsyncStorage.setItem('accessToken', accessToken);
            // 새로운 토큰으로 원래 요청 재시도
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            await handleLogout();
            // 401과 403 에러 구분
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

// 파일 상단에 handleLogout 함수 추가
const handleLogout = async () => {
  // 모든 인증 관련 데이터 제거
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  // 로그인 화면으로 이동
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'AuthStackNav' }],
    });
  }
};

export default client;
