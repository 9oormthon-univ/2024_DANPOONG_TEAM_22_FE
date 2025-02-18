import client from '@apis/client';

export interface PostAlarmSettingToggleRequest {
  alarmCategory: 'WAKE_UP' | 'GO_OUT' | 'MEAL_BREAKFAST' | 'MEAL_LAUNCH' | 'MEAL_DINNER' | 'SLEEP';
  enabled: boolean;
}

interface PostAlarmSettingToggleResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    success: boolean;
  };
}

export const postAlarmSettingToggle = async (data: PostAlarmSettingToggleRequest): Promise<boolean> => {
  try {
    const response = await client.post<PostAlarmSettingToggleResponse>(
      `/api/v1/alarm-setting/toggle/${data.alarmCategory}/${data.enabled}`,
    );
    return response.data.result.success;
  } catch (error) {
    console.log('알림 설정 토글 오류:', error);
    throw error;
  }
};
