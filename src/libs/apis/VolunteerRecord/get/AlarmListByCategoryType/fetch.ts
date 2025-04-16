import { client } from '@apis/client';
import { type RecordType } from '@type/RecordType';

import {
  type AlarmListByCategoryTypeResponse,
  type AlarmListByCategoryTypeType,
} from './type';

export const getAlarmListByCategoryType = async (
  categoryType: RecordType,
): Promise<AlarmListByCategoryTypeType[]> => {
  try {
    const response = await client.get<AlarmListByCategoryTypeResponse>(
      `/api/v1/alarm/list/${categoryType}`,
    );

    return response.data.result;
  } catch (error) {
    console.log('알람 목록 가져오기 오류:', error);

    throw error;
  }
};
