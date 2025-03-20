/**
 * 로딩 상태를 관리하는 훅
 * 
 * 설명:
 * 이 훅은 컴포넌트에서 로딩 상태를 쉽게 관리할 수 있도록 해줍니다.
 * API 호출이나 데이터 처리 등의 비동기 작업 중 로딩 상태를 표시하는 데 사용됩니다.
 * 
 * 입력: 없음
 * 
 * 출력:
 * @returns {Object} 로딩 상태 객체
 * @returns {boolean} isLoading - 현재 로딩 중인지 여부
 * @returns {Function} setIsLoading - 로딩 상태를 변경하는 함수
 */
import { useState } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
    setIsLoading,
  };
};
