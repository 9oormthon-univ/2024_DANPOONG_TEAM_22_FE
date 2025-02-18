import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

interface DeleteLogoutResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    memberId: number;
  };
}

export const deleteLogout = async (): Promise<DeleteLogoutResponse> => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await axios.delete<DeleteLogoutResponse>(
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
