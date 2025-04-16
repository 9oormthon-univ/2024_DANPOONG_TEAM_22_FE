import { client } from '@apis/client';

import {
  type patchMemberInfoYouthRequest,
  type patchMemberInfoYouthResponse,
} from './type';

export const patchMemberInfoYouth = async (
  data: patchMemberInfoYouthRequest,
): Promise<number> => {
  try {
    const response = await client.patch<patchMemberInfoYouthResponse>(
      '/api/v1/member/info/youth',
      data,
    );

    return response.data.result.memberId;
  } catch (error) {
    console.log('청년 회원 정보 수정 오류:', error);

    throw error;
  }
};
