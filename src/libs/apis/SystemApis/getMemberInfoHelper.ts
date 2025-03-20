import client from '@apis/client';

type GetMemberInfoHelperResponse ={
    timestamp: string;
    code: string;
    message: string;
    result: {
        thankYouMessage: boolean;
        welcomeReminder: boolean;
    };
}

export const getMemberInfoHelper = async () => {
  try {
    const response = await client.get<GetMemberInfoHelperResponse>(
      '/api/v1/member/info/helper',
    );
    return response.data.result;
  } catch (error) {
    console.log('헬퍼 정보 조회 오류:', error);
    throw error;
  }
};
