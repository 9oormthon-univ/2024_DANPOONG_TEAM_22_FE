import {client} from '@apis/client';
import {ResultResponseData} from '@type/api/common';

export const postVoicefilesByVoiceFileId = async (
  voicefileId: number,
  file:FormData,
): Promise<ResultResponseData<string>> => {
  try {
    const response = await client.post<ResultResponseData<string>>(
      `/api/v1/voicefiles/${voicefileId}`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('음성 파일 저장 오류:', error);
    throw error;
  }
};
