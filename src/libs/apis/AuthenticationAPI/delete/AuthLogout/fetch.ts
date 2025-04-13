import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import {client} from '@apis/client';
import { deleteAuthLogoutResponse } from './type';


export const deleteAuthLogout = async (): Promise<deleteAuthLogoutResponse> => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await axios.delete<deleteAuthLogoutResponse>(
      `${Config.API_URL}/api/v1/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('로그아웃 오류:', error);
    throw error;
  }
};
