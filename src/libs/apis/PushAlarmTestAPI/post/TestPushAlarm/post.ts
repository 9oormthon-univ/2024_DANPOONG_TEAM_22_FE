// 청년 푸시 알림 테스트 API
import { client } from '@apis/client';
import { type PostTestPushAlarmRequest } from '@apis/PushAlarmTestAPI/post/TestPushAlarm/type';
import { type ResultResponseData } from '@type/api/common';

export const postTestPushAlarm = async ({
  fcmToken,
  title,
  alarmId,
}: PostTestPushAlarmRequest) => {
  const res = await client.post<ResultResponseData<string>>(
    `/api/v1/test-push/alarm?fcmToken=${fcmToken}&title=${title}&alarmId=${alarmId}`,
  );

  return res.data;
};
