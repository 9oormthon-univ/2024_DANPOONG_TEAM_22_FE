import client from '../client'

interface RCDResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    categoryId: number;
    title: string;
    count: number;
    used: boolean;
  }[];
}

export interface RCD {
  categoryId: number;
  title: string;
  count: number;
  used: boolean;
}

export const getRCDList = async (categoryType: 'DAILY' | 'COMFORT'): Promise<RCD[]> => {
  try {
    const response = await client.get<RCDResponse>(`/api/v1/alarm/list/${categoryType}`);
    return response.data.result;
  } catch (error) {
    console.error('RCD 목록 가져오기 오류:', error);
    throw error;
  }
}
