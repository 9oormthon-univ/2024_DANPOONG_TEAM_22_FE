import client from '@apis/client';

type DeleteMemberResponse ={
    timestamp: string; 
    code: string;
    message: string;
    result: {
        memberId: number;
    };
}

export type DeleteMemberRequest= {
  reasonList: string[];
}

export const deleteMember = async (data: DeleteMemberRequest): Promise<DeleteMemberResponse> => {
  try {
    const response = await client.delete<DeleteMemberResponse>(
      '/api/v1/member',
      { data }
    );
    return response.data;
  } catch (error) {
    console.log('회원 탈퇴 오류:', error);
    throw error;
  }
};
