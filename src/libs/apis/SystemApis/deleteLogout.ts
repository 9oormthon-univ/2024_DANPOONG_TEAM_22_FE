import client from '@apis/client';

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
    const response = await client.delete<DeleteLogoutResponse>(
      '/api/v1/auth/logout',
    );
    return response.data;
  } catch (error) {
    console.log('로그아웃 오류:', error);
    throw error;
  }
};
