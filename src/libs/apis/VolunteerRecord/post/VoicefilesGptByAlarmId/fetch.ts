import { client } from '@apis/client';

import { type VoicefilesGptByAlarmIdResponse } from './type';

export const postVoicefilesGptByAlarmId = async (
  alarmId: number,
): Promise<VoicefilesGptByAlarmIdResponse> => {
  try {
    const response = await client.post<VoicefilesGptByAlarmIdResponse>(
      `/api/v1/voicefiles/${alarmId}/gpt`,
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log('GPT 요청 오류:', error);

    throw error;
  }
};
