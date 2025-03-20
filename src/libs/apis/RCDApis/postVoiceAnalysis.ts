import client from '@apis/client';

type PostVoiceAnalysisResponse ={
    timestamp: string;
    code: string;
    message: string;
    result: string;
}

export const postVoiceAnalysis = async (
  voiceFileId: number,
): Promise<PostVoiceAnalysisResponse> => {
  try {
    const response = await client.post<PostVoiceAnalysisResponse>(
      `/api/v1/voicefiles/analysis/${voiceFileId}`,
    );
    console.log('postVoiceAnalysis', response.data);
    return response.data;
  } catch (error) {
    console.log('음성 파일 분석 오류:', error);
    throw error;
  }
};
