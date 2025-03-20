import {client} from '@apis/client';

type PostSaveScriptRequest ={
  content: string;
}

type PostSaveScriptResponse ={
  timestamp: string;
  code: string;
  message: string;
  result: {
    voiceFileId: number;
    process: string;
    content: string;
  };
}

export const postVoicefilesAlarmIdSelf = async (
  alarmId: number,
  content: string,
): Promise<PostSaveScriptResponse> => {
  try {
    const requestBody: PostSaveScriptRequest = {
      content,
    };
    const response = await client.post<PostSaveScriptResponse>(
      `/api/v1/voicefiles/${alarmId}/self`,
      requestBody,
    );
    return response.data;
  } catch (error) {
    console.log('스크립트 저장 오류:', error);
    throw error;
  }
};
