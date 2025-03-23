import { useEffect } from 'react';
import { Alert } from 'react-native';
import Config from 'react-native-config';

import client from '@apis/client';
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

    return () => {
      client.interceptors.request.eject(requestInterceptor);
      client.interceptors.response.eject(responseInterceptor);
    };
  }, [navigation]);
};
