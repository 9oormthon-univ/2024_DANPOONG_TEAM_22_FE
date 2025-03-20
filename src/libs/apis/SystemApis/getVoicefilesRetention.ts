import {client} from '@apis/client';

export type VoicefilesRetentionResponse= {
  timestamp: string;
  code: string;
  message: string;
  result: {
    voiceCount: number;
    thanksCount: number; 
    messageCount: number;
  }
}

export const getVoicefilesRetention = async (): Promise<VoicefilesRetentionResponse['result']> => {
  try {
    const response = await client.get<VoicefilesRetentionResponse>(
      '/api/v1/voicefiles/retention'
    );
    return response.data.result;
  } catch (error) {
    console.log('음성 파일 보유 현황 조회 오류:', error);
    throw error;
  }
};
