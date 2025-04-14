import { client } from '@apis/client';

import { type deleteMemberRequest, type deleteMemberResponse } from './type';

export const deleteMember = async (
  data: deleteMemberRequest,
): Promise<deleteMemberResponse> => {
  try {
    const response = await client.delete<deleteMemberResponse>(
      '/api/v1/member',
      { data },
    );

    return response.data;
  } catch (error) {
    console.log('회원 탈퇴 오류:', error);

    throw error;
  }
};
