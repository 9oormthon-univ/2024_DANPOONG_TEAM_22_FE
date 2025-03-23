import {ValidationResult} from '@hooks/useValidateInput';

export const NICKNAME_MESSAGES = {
  SUCCESS: '사용 가능한 닉네임이에요',
  DEFAULT: '2자 이상 10자 이내의 한글, 영문, 숫자만 입력해주세요',
  TOO_SHORT: '2자 이상 입력하세요',
  TOO_LONG: '10자 이내로 입력하세요',
  NO_SPACES: '공백을 제거해주세요',
  NO_SPECIAL_CHARS: '특수문자를 제거해주세요',
};

const NICKNAME_REGEX = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9]{2,10}$/;
const SPACES_REGEX = /\s/;
const SPECIAL_CHARS_REGEX = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

export const validateNickname = (text: string): ValidationResult => {
  if (text === '') {
    return {
      isValid: false,
      isError: false,
      isSuccess: false,
      message: NICKNAME_MESSAGES.DEFAULT,
    };
  } else if (text.length < 2) {
    return {
      isValid: false,
      isError: true,
      isSuccess: false,
      message: NICKNAME_MESSAGES.TOO_SHORT,
    };
  } else if (text.length > 10) {
    return {
      isValid: false,
      isError: true,
      isSuccess: false,
      message: NICKNAME_MESSAGES.TOO_LONG,
    };
  } else if (SPACES_REGEX.test(text)) {
    return {
      isValid: false,
      isError: true,
      isSuccess: false,
      message: NICKNAME_MESSAGES.NO_SPACES,
    };
  } else if (SPECIAL_CHARS_REGEX.test(text)) {
    return {
      isValid: false,
      isError: true,
      isSuccess: false,
      message: NICKNAME_MESSAGES.NO_SPECIAL_CHARS,
    };
  } else if (NICKNAME_REGEX.test(text)) {
    return {
      isValid: true,
      isError: false,
      isSuccess: true,
      message: NICKNAME_MESSAGES.SUCCESS,
    };
  }
  return {
    isValid: false,
    isError: false,
    isSuccess: false,
    message: NICKNAME_MESSAGES.DEFAULT,
  };
};

