import client from '@apis/client';

type TopTextResponse= {
  timestamp: string;
  code: string;
  message: string;
  result: {
    alarmId: number;
    alarmCategory: string;
    title: string;
  };
}

export type TopText= {
  alarmId: number;
  alarmCategory: string;
  title: string;
}

export const getTopText = async (childrenAlarmCategory: string): Promise<TopText> => {
  try {
    const response = await client.get<TopTextResponse>(
      `/api/v1/alarm/alarm-category/${childrenAlarmCategory}/detail`,
    );
    return response.data.result;
  } catch (error) {
    console.log('상단 텍스트 가져오기 오류:', error);
    throw error;
  }
};
