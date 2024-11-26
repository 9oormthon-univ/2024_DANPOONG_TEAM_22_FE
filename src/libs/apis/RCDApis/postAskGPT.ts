import client from '../client'

export interface PostAskGPTResponse {
  timestamp: string;
  code: string; 
  message: string;
  result: {
    voiceFileId: number;
    process: string;
    content: string;
  }
}

export const postAskGPT = async (alarmId: number): Promise<PostAskGPTResponse> => {
  try {
    const response = await client.post<PostAskGPTResponse>(
      `/api/v1/voicefiles/${alarmId}/gpt`
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('GPT 요청 오류:', error);
    throw error;
  }
}
