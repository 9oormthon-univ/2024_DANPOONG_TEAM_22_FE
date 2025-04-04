import {client} from '@apis/client';
import { getMemberInfoHelperResponse } from './type';

export const getMemberInfoHelper = async () => {
  try {
    const response = await client.get<getMemberInfoHelperResponse>(
      '/api/v1/member/info/helper',
    );
    return response.data.result;
  } catch (error) {
    console.log('헬퍼 정보 조회 오류:', error);
    throw error;
  }
};
