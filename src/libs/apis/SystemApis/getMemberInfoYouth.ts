import client from '@apis/client';

interface GetMemberInfoYouthResponse {
    timestamp: string;
    code: string;
    message: string;
    result: {
        wakeUpTime: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        sleepTime: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        breakfast: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        lunch: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        dinner: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
        outgoingTime: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
        };
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
