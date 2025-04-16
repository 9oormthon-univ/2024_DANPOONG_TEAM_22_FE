import { client } from '@apis/client';

import { type postVoicefilesAnalysisByVoiceFileIdResponse } from './type.ts';

export const postVoicefilesAnalysisByVoiceFileId = async (
  voiceFileId: number,
): Promise<postVoicefilesAnalysisByVoiceFileIdResponse> => {
  try {
    const response =
      await client.post<postVoicefilesAnalysisByVoiceFileIdResponse>(
        `/api/v1/voicefiles/analysis/${voiceFileId}`,
      );

    return response.data;
  } catch (error) {
    console.log('음성 파일 분석 오류:', error);

    throw error;
  }
};
