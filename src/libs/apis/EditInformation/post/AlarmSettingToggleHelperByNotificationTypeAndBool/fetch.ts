//봉사자 알림 수정 api
import { client } from '@apis/client';

import {
  type postAlarmSettingToggleHelperByNotificationTypeAndBoolRequest,
  type postAlarmSettingToggleHelperByNotificationTypeAndBoolResponse,
} from './type';

export const postAlarmSettingToggleHelperByNotificationTypeAndBool = async (
  data: postAlarmSettingToggleHelperByNotificationTypeAndBoolRequest,
): Promise<boolean> => {
  try {
    const response =
      await client.post<postAlarmSettingToggleHelperByNotificationTypeAndBoolResponse>(
        `/api/v1/alarm-setting/toggle/helper/${data.alarmCategory}/${data.enabled}`,
      );

    return response.data.code === '200';
  } catch (error) {
    console.log('알림 설정 토글 오류:', error);

    throw error;
  }
};
