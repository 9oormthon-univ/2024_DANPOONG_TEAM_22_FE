import client from '@apis/client';

export interface GetMemberInfoYouthResponse {
    timestamp: string;
    code: string;
    message: string;
    result: {
        wakeUpTime: string;
        sleepTime: string;
        breakfast: string;
        lunch: string;
        dinner: string;
        outgoingTime: string;
        wakeUpAlarm: boolean;
        sleepAlarm: boolean;
        breakfastAlarm: boolean;
        lunchAlarm: boolean;
        dinnerAlarm: boolean;
        outgoingAlarm: boolean;
    };
}

export const getMemberInfoYouth = async () => {
  try {
    const response = await client.get<GetMemberInfoYouthResponse>(
      '/api/v1/member/info/youth',
    );
    return response.data.result;
  } catch (error) {
    console.log('청소년 정보 조회 오류:', error);
    throw error;
  }
};
