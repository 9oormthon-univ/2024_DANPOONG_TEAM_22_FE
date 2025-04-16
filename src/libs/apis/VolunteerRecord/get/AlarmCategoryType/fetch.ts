import { client } from '@apis/client';

import {
  type AlarmCategoryType,
  type getAlarmCategoryTypeResponse,
} from './type';

//이거 안쓰는거 같다
export const getAlarmCategoryType = async (): Promise<AlarmCategoryType[]> => {
  try {
    const response = await client.get<getAlarmCategoryTypeResponse>(
      '/api/v1/alarm/category-type',
    );

    return response.data.result;
  } catch (error) {
    console.log('알람 카테고리 타입 가져오기 오류:', error);

    throw error;
  }
};
