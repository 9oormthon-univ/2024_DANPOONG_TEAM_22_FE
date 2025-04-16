//청년 알림 설정 수정 API
import { client } from '@apis/client';

import {
  type PostAlarmSettingToggleByAlarmCategoryAndBoolRequest,
  type PostAlarmSettingToggleByAlarmCategoryAndBoolResponse,
} from './type';

export const postAlarmSettingToggleByAlarmCategoryAndBool = async (
  data: PostAlarmSettingToggleByAlarmCategoryAndBoolRequest,
): Promise<boolean> => {
  try {
    const response =
      await client.post<PostAlarmSettingToggleByAlarmCategoryAndBoolResponse>(
        `/api/v1/alarm-setting/toggle/${data.alarmCategory}/${data.enabled}`,
      );

    return response.data.code === '200';
  } catch (error) {
    console.log('알림 설정 토글 오류:', error);

    throw error;
  }
};
