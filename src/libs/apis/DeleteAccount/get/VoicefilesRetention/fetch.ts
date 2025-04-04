import {client} from '@apis/client';
import { getVoicefilesRetentionResponse } from './type';

export const getVoicefilesRetention = async (): Promise<getVoicefilesRetentionResponse['result']> => {
  try {
    const response = await client.get<getVoicefilesRetentionResponse>(
      '/api/v1/voicefiles/retention'
    );
    return response.data.result;
  } catch (error) {
    console.log('음성 파일 보유 현황 조회 오류:', error);
    throw error;
  }
};
