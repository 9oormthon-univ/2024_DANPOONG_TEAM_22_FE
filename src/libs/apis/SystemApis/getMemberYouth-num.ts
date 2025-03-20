import {client} from '@apis/client';

type GetMemberYouthNumResponse= {
    timestamp: string;
    code: string;
    message: string;
    result: {
        youthMemberNum: number;
    };
}

export const getMemberYouthNum = async (): Promise<number> => {
  try {
    const response = await client.get<GetMemberYouthNumResponse>(
      '/api/v1/member/youth-num',
    );
    return response.data.result.youthMemberNum;
  } catch (error) {
    console.log('청소년 번호 조회 오류:', error);
    throw error;
  }
};
