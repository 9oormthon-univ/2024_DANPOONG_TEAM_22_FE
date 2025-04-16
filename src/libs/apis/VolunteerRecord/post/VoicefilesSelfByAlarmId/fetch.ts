import { client } from '@apis/client';

import {
  type VoicefilesSelfByAlarmIdRequest,
  type VoicefilesSelfByAlarmIdResponse,
} from './type';

export const postVoicefilesSelfByAlarmId = async (
  alarmId: number,
  content: string,
): Promise<VoicefilesSelfByAlarmIdResponse> => {
  try {
    const requestBody: VoicefilesSelfByAlarmIdRequest = {
      content,
    };
    const response = await client.post<VoicefilesSelfByAlarmIdResponse>(
      `/api/v1/voicefiles/${alarmId}/self`,
      requestBody,
    );

    return response.data;
  } catch (error) {
    console.log('스크립트 저장 오류:', error);

    throw error;
  }
};
