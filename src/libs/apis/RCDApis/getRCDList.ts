import client from '@apis/client';
import { RecordType } from '@type/RecordType';
interface RCDResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    alarmCategory: string;
    koreanName: string;
    title: string;
    children: string[];
    used: boolean;
  }[];
}
export interface RCD {
  alarmCategory: string;
  koreanName: string;
  title: string;
  children: string[];
  used: boolean;
}

export const getRCDList = async (
  categoryType: RecordType,
): Promise<RCD[]> => {
  try {
    const response = await client.get<RCDResponse>(
      `/api/v1/alarm/list/${categoryType}`,
    );
    return response.data.result;
  } catch (error) {
    console.log('RCD 목록 가져오기 오류:', error);
    throw error;
  }
};
