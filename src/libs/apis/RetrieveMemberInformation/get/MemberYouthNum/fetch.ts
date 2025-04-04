import {client} from '@apis/client';
import { getMemberYouthNumResponse } from './type';


export const getMemberYouthNum = async (): Promise<number> => {
  try {
    const response = await client.get<getMemberYouthNumResponse>(
      '/api/v1/member/youth-num',
    );
    return response.data.result.youthMemberNum;
  } catch (error) {
    console.log('청년 수 가져오기 오류:', error);
    throw error;
  }
};
