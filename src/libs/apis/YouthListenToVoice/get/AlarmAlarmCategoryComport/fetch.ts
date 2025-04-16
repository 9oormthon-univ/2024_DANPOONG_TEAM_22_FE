import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import { type AlarmComfortResponseData } from './type';

export const getAlarmAlarmCategoryComport = async () => {
  const res = await client.get<ResultResponseData<AlarmComfortResponseData[]>>(
    '/api/v1/alarm/alarm-category/comfort',
  );

  return res.data;
};
