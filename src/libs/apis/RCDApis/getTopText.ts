import client from '../client'

interface TopTextResponse {
  timestamp: string;
  code: string; 
  message: string;
  result: {
    alarmId: number;
    title: string;
  };
}

export interface TopText {
  alarmId: number;
  title: string;
}

export const getTopText = async (alarmCategoryId: number): Promise<TopText> => {
  try {
    const response = await client.get<TopTextResponse>(
      `/api/v1/alarm/alarm-category/${alarmCategoryId}/optimized`
    );
    return response.data.result;
  } catch (error) {
    console.error('상단 텍스트 가져오기 오류:', error);
    throw error;
  }
}
