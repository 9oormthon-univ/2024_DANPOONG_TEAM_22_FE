import client from '../client'

interface PostSaveVoiceResponse {
  timestamp: string;
  code: string;
  message: string;
  result: string;
}

export const postSaveVoice = async (voicefileId: number, file: string): Promise<PostSaveVoiceResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await client.post<PostSaveVoiceResponse>(
      `/api/v1/voicefiles/${voicefileId}/voice`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('음성 파일 저장 오류:', error);
    throw error;
  }
}
