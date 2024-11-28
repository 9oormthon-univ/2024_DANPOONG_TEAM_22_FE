import client from '../client'

interface TopTextResponse {
  timestamp: string;
  code: string; 
  message: string;
  result: {
    alarmId: number;
    alarmCategory: string;
    title: string;
  };
}

export interface TopText {
  alarmId: number;
  alarmCategory: string;
  title: string;
}

export const getTopText = async (alarmCategory: string): Promise<TopText> => {
  try {
    const response = await client.get<TopTextResponse>(
      `/api/v1/alarm/alarm-category/${alarmCategory}/detail`
    );
    return response.data.result;
  } catch (error) {
    console.log('상단 텍스트 가져오기 오류:', error);
    throw error;
  }
}
