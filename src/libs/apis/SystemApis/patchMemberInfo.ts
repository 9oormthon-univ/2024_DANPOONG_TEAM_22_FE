import client from '@apis/client';

export interface PatchMemberInfoRequest {
  name: string;
  gender: 'MALE' | 'FEMALE';
  profileImage: string;
  role: 'HELPER' | 'YOUTH';
  birth: string;
  fcmToken: string;
}

interface PatchMemberInfoResponse {
  timestamp: string;
  code: string; 
  message: string;
  result: {
    memberId: number;
  };
}

export const patchMemberInfo = async (data: PatchMemberInfoRequest): Promise<number> => {
  try {
    const response = await client.patch<PatchMemberInfoResponse>(
      '/api/v1/member/info',
      data
    );
    return response.data.result.memberId;
  } catch (error) {
    console.log('회원 정보 수정 오류:', error);
    throw error;
  }
};