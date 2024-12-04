import client from '@apis/client';

interface CategoryTypeResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    categoryType: 'DAILY' | 'COMFORT';
    koreanName: string;
  }[];
}

export interface CategoryType {
  categoryType: 'DAILY' | 'COMFORT';
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