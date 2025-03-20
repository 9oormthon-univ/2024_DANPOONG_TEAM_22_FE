//청년 알림 설정 수정 API
import client from '@apis/client';

export type PostAlarmSettingToggleRequest= {
  alarmCategory: 'WAKE_UP' | 'GO_OUT' | 'MEAL_BREAKFAST' | 'MEAL_LUNCH' | 'MEAL_DINNER' | 'SLEEP';
  enabled: boolean;
}

type PostAlarmSettingToggleResponse ={
  code: '200';
  message: 'OK';
}

export const postAlarmSettingToggle = async (data: PostAlarmSettingToggleRequest): Promise<boolean> => {
  try {
    const response = await client.post<PostAlarmSettingToggleResponse>(
      `/api/v1/alarm-setting/toggle/${data.alarmCategory}/${data.enabled}`,
    );
    return response.data.code === '200';
  } catch (error) {
    console.log('알림 설정 토글 오류:', error);
    throw error;
  }
};
