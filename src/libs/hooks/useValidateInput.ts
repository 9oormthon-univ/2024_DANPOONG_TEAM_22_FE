/**
 * 입력값 유효성 검증을 관리하는 훅
 * 
 * 설명:
 * 이 훅은 사용자 입력값(예: 닉네임)의 유효성을 검증하고 관련 상태를 관리합니다.
 * 지정된 유효성 검증 유형에 따라 입력값을 실시간으로 검증하고 결과를 반환합니다.
 * 
 * 입력:
 * @param {Object} params - 파라미터 객체
 * @param {ValidateInputType} params.type - 유효성 검증 유형 (예: 'nickname')
 * 
 * 출력:
 * @returns {Object} 유효성 검증 상태 객체
 * @returns {string} value - 현재 입력값
 * @returns {Function} setValue - 입력값을 변경하는 함수
 * @returns {boolean} isValid - 입력값이 유효한지 여부
 * @returns {boolean} isError - 오류가 있는지 여부
 * @returns {boolean} isSuccess - 유효성 검증이 성공했는지 여부
 * @returns {string} message - 유효성 검증 메시지
 */
import {validateNickname} from '@utils/validation/validateNickname';
import {useState} from 'react';

export type ValidationResult = {
  isValid: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

type ValidateInputType = 'nickname';

const VALIDATION_MAP: Record<
  ValidateInputType,
  (text: string) => ValidationResult
> = {
  nickname: validateNickname,
};

export const useValidateInput = ({type}: Readonly<{type: ValidateInputType}>) => {
  const [value, setValue] = useState('');
  const {isValid, isError, isSuccess, message} = VALIDATION_MAP[type](value);
  return {value, setValue, isValid, isError, isSuccess, message};
};
