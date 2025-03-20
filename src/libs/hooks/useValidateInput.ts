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
