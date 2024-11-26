import client from '../client'

interface PostVoiceAnalysisResponse {
  timestamp: string;
  code: string;
  message: string;
  result: string;
}
export interface VoiceAnalysisErrorResponse {
  timestamp: string;
  code: string;
  message: string;
}

export const postVoiceAnalysis = async (file: FormData, voiceFileId: number): Promise<PostVoiceAnalysisResponse> => {
  try {
    const response = await client.post<PostVoiceAnalysisResponse>(
      `/api/v1/voicefiles/${voiceFileId}`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('음성 파일 분석 오류:', error);
    throw error;
  }
}
