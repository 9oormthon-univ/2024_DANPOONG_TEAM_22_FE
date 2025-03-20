import client from '@apis/client';

type PostSaveVoiceResponse ={
  timestamp: string;
  code: string;
  message: string;
  result: string;
}

export const postSaveVoice = async (
  voicefileId: number,
  file:FormData,
): Promise<PostSaveVoiceResponse> => {
  try {
    const response = await client.post<PostSaveVoiceResponse>(
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
