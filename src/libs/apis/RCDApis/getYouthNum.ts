import client from '@apis/client';

interface YouthNumResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    youthMemberNum: number;
  };
}

export const getYouthNum = async (): Promise<number> => {
  try {
    const response = await client.get<YouthNumResponse>(
      '/api/v1/member/youth-num',
    );
    return response.data.result.youthMemberNum;
  } catch (error) {
    console.log('청년 수 가져오기 오류:', error);
    throw error;
  }
};
