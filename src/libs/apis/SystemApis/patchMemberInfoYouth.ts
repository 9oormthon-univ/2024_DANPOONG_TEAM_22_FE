import client from '@apis/client';

export type PatchMemberInfoYouthRequest= {
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  outgoingTime: string;
}

type PatchMemberInfoYouthResponse ={
  timestamp: string;
  code: string;
  message: string;
  result: {
    memberId: number;
  };
}

export const patchMemberInfoYouth = async (data: PatchMemberInfoYouthRequest): Promise<number> => {
  try {
    const response = await client.patch<PatchMemberInfoYouthResponse>(
      '/api/v1/member/info/youth',
      data
    );
    return response.data.result.memberId;
  } catch (error) {
    console.log('청년 회원 정보 수정 오류:', error);
    throw error;
  }
};
