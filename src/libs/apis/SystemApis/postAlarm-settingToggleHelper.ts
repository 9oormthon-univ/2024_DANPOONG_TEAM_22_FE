//봉사자 알림 수정 api
import {client} from '@apis/client';

export type PostAlarmSettingToggleRequest ={
  alarmCategory: 'WELCOME_REMINDER' | 'THANK_YOU_MESSAGE';
  enabled: boolean;
}

type PostAlarmSettingToggleResponse ={
  code: '200';
  message: 'OK';
}

export const postAlarmSettingToggle = async (data: PostAlarmSettingToggleRequest): Promise<boolean> => {
  try {
    const response = await client.post<PostAlarmSettingToggleResponse>(
      `/api/v1/alarm-setting/toggle/helper/${data.alarmCategory}/${data.enabled}`,
    );
    return response.data.code === '200';
  } catch (error) {
    console.log('알림 설정 토글 오류:', error);
    throw error;
  }
};
