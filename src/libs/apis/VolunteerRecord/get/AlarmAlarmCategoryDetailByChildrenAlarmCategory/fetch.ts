import { client } from '@apis/client';

import {
  type AlarmType,
  type getAlarmAlarmCategoryDetailByChildrenAlarmCategoryResponse,
} from './type';

export const getAlarmAlarmCategoryDetailByChildrenAlarmCategory = async (
  childrenAlarmCategory: string,
): Promise<AlarmType> => {
  try {
    const response =
      await client.get<getAlarmAlarmCategoryDetailByChildrenAlarmCategoryResponse>(
        `/api/v1/alarm/alarm-category/${childrenAlarmCategory}/detail`,
      );

    return response.data.result;
  } catch (error) {
    console.log('알람 알람 카테고리 상세 가져오기 오류:', error);

    throw error;
  }
};
