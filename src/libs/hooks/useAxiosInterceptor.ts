import client from '@apis/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {logRequest, logResponse, logResponseError} from '@utils/logger';
import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import Config from 'react-native-config';

type RootProps = NativeStackNavigationProp<RootStackParamList>;

export const useAxiosInterceptor = () => {
  const navigation = useNavigation<RootProps>();

  useEffect(() => {
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
            routes: [{name: 'AuthStackNav'}],
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
        const {accessToken} = response.data.result;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        return accessToken;
      } catch (error: any) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('role');
          Alert.alert('세션이 만료되어 로그인 페이지로 이동합니다.');
          navigation.reset({
            index: 0,
            routes: [{name: 'AuthStackNav'}],
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
