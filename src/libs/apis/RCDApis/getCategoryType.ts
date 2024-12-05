import client from '@apis/client';
import { RecordType } from '@type/RecordType';
interface CategoryTypeResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    categoryType: RecordType;
    koreanName: string;
  }[];
}

export interface CategoryType {
  categoryType: RecordType;
  koreanName: string;
}

export const getCategoryType = async (): Promise<CategoryType[]> => {
  try {
    const response = await client.get<CategoryTypeResponse>(
      '/api/v1/alarm/category-type',
    );
    return response.data.result;
  } catch (error) {
    console.log('카테고리 타입 가져오기 오류:', error);
    throw error;
  }
};