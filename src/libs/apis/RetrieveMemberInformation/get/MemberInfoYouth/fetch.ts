import { client } from '@apis/client';

import { type getMemberInfoYouthResponse } from './type';

export const getMemberInfoYouth = async (): Promise<
  getMemberInfoYouthResponse['result']
> => {
  try {
    const response = await client.get<getMemberInfoYouthResponse>(
      '/api/v1/member/info/youth',
    );

    return response.data.result;
  } catch (error) {
    console.log('청소년 정보 조회 오류:', error);

    throw error;
  }
};
