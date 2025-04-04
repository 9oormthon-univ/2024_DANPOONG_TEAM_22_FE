import {client} from '@apis/client';
import { patchMemberInfoRequest, patchMemberInfoResponse } from './type';
export const patchMemberInfo = async (data: patchMemberInfoRequest): Promise<number> => {
  try {
    const response = await client.patch<patchMemberInfoResponse>(
      '/api/v1/member/info',
      data
    );
    return response.data.result.memberId;
  } catch (error) {
    console.log('회원 정보 수정 오류:', error);
    throw error;
  }
};