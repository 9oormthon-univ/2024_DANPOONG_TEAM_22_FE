import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import { type getAlarmAlarmCategoryResponse } from './type';

export const getAlarmAlarmCategory = async () => {
  const res = await client.get<
    ResultResponseData<getAlarmAlarmCategoryResponse[]>
  >('/api/v1/alarm/alarm-category/');

  return res.data;
};
