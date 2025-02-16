import validateNickname from '@utils/validation/validateNickname';
import {useState} from 'react';

export type ValidationResult = {
  isValid: boolean;
  isError: boolean;
  message: string;
};

type ValidateInputType = 'nickname';

const VALIDATION_MAP: Record<
  ValidateInputType,
  (text: string) => ValidationResult
> = {
  nickname: validateNickname,
};

const useValidateInput = ({type}: Readonly<{type: ValidateInputType}>) => {
  const [value, setValue] = useState('');
  const {isValid, isError, message} = VALIDATION_MAP[type](value);
  return {value, setValue, isValid, isError, message};
};

export default useValidateInput;
