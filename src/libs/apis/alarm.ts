import client from '@apis/client';
import {
  AlarmCategoryDetailRequestData,
  AlarmCategoryDetailResponseData,
  AlarmCategoryRequestData,
  AlarmCategoryResponseData,
  AlarmComfortResponseData,
  AlarmData,
} from '@type/api/alarm';
import {ResultResponseData} from '@type/api/common';

const getAlarmComfort = async () => {
  const res = await client.get<ResultResponseData<AlarmComfortResponseData[]>>(
    '/api/v1/alarm/alarm-category/comfort',
  );
  return res.data;
};

const getAlarmCategoryByAlarmCategoryId = async ({
  alarmCategoryId,
}: Readonly<AlarmCategoryRequestData>) => {
  const res = await client.get<ResultResponseData<AlarmCategoryResponseData>>(
    `/api/v1/alarm/alarm-category/${alarmCategoryId}`,
  );
  return res.data;
};

const getAlarmCategory = async () => {
  const res = await client.get<ResultResponseData<AlarmData[]>>(
    '/api/v1/alarm/alarm-category/',
  );
  return res.data;
};

const getAlarmCategoryDetail = async ({
  childrenAlarmCategory,
}: Readonly<AlarmCategoryDetailRequestData>) => {
  const res = await client.get<
    ResultResponseData<AlarmCategoryDetailResponseData>
  >(`/api/v1/alarm/alarm-category/${childrenAlarmCategory}/detail`);
  return res.data;
};

export {
  getAlarmComfort,
  getAlarmCategoryByAlarmCategoryId,
  getAlarmCategory,
  getAlarmCategoryDetail,
};
