/**
 * Axios 인터셉터 훅
 * 
 * 설명:
 * 이 훅은 API 요청과 응답을 가로채서 처리하는 인터셉터를 설정합니다.
 * 주요 기능:
 * 1. 요청 시 자동으로 인증 토큰 추가
 * 2. 401 에러 발생 시 토큰 갱신 시도
 * 3. 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
 * 4. 요청/응답 로깅
 * 
 * 입력: 없음
 * 출력: 없음 (사이드 이펙트: Axios 인터셉터 설정)
 */
import { client } from '@apis/client';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type RootStackParamList } from '@type/nav/RootStackParamList';
import { logRequest, logResponse, logResponseError } from '@utils/logger';
import { showToast } from '@utils/showToast';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

type RootProps = NativeStackNavigationProp<RootStackParamList>;

export const useAxiosInterceptor = () => {
  const navigation = useNavigation<RootProps>();

  useEffect(() => {
    /**
     * 요청 핸들러
     * 모든 요청에 인증 토큰을 추가하고 로깅합니다.
     * 
     * @param config - Axios 요청 설정
     * @returns 수정된 설정
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestHandler = async (config: InternalAxiosRequestConfig<any>) => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      console.log('accessToken in interceptor', accessToken);

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      logRequest(config);

      return config;
    };

    // Request interceptor for API calls
    const requestInterceptor = client.interceptors.request.use(
      requestHandler,
      (error: AxiosError) => Promise.reject(error),
    );

    /**
     * 에러 핸들러
     * 401 에러 발생 시 토큰 갱신을 시도합니다.
     * 
     * @param error - Axios 에러 객체
     * @returns 재시도된 요청 또는 에러
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorHandler = async (error: any) => {
      const originalRequest = error.config;

      logResponseError(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        console.log('refreshToken in interceptor', refreshToken);

        if (!refreshToken) {
          await AsyncStorage.removeItem('accessToken');
          Alert.alert('로그인이 필요한 페이지입니다.');
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStackNav' }],
          });

          return Promise.reject(error);
        }

        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken(refreshToken);

        console.log('newAccessToken in interceptor', newAccessToken);

        if (newAccessToken) {
          client.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return client(originalRequest);
        }
      }

      return Promise.reject(error);
    };

    // Response interceptor for API calls
    const responseInterceptor = client.interceptors.response.use(response => {
      logResponse(response);

      return response;
    }, errorHandler);

    /**
     * 액세스 토큰 갱신 함수
     * 리프레시 토큰을 사용하여 새 액세스 토큰을 요청합니다.
     * 
     * @param refreshToken - 리프레시 토큰
     * @returns 새 액세스 토큰 또는 null
     */
    const refreshAccessToken = async (refreshToken: string) => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/api/v1/auth/token/refresh`,
          {
            headers: {
              refreshToken,
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        console.log('refreshAccessToken in interceptor', response);

        const { accessToken } = response.data.result;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        return accessToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('role');

          showToast({
            text: '안전한 이용을 위해 로그아웃되었어요.',
            type: 'notice',
            position: 'top',
          });

          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStackNav' }],
          });
        }

        return null;
      }
    };

    // 클린업 함수: 인터셉터 제거
    return () => {
      client.interceptors.request.eject(requestInterceptor);
      client.interceptors.response.eject(responseInterceptor);
    };
  }, [navigation]);
};
