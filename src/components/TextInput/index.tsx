import { useRef, useState } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

import { CustomText } from '@components/CustomText';
import { COLORS } from '@constants/Colors';

import ErrorIcon from '@assets/svgs/TextInputError.svg';

type TextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isError?: boolean;
  isSuccess?: boolean;
  message?: string;
  maxLength?: number;
  autoFocus?: boolean;
};

// TextInput 컴포넌트
export const TextInput = ({
  value,
  onChangeText,
  placeholder = '텍스트를 입력해주세요',
  isError = false,
  isSuccess = false,
  message,
  maxLength,
  autoFocus = false,
}: TextInputProps) => {
  // TextInput 레퍼런스 생성
  const textInputRef = useRef<RNTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <View
        className={`flex-row h-auto items-center justify-between w-full rounded-lg border border-gray300 ${
          !isFocused || !autoFocus ? 'bg-[#fafafa1a]' : 'bg-transparent'
        }`}>
        <RNTextInput
          autoFocus={autoFocus}
          ref={textInputRef}
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            fontFamily: 'WantedSans-Regular',
            fontSize: 18,
            lineHeight: 18 * 1.5,
            letterSpacing: 18 * -0.025,
            color: COLORS.white,
          }}
          className={'flex-1 py-[16] px-[24]'}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray300}
          autoCapitalize="none"
          cursorColor={COLORS.white}
          multiline
          textAlign="left"
          maxLength={maxLength}
        />
        {isError && (
          <View className="m-[16]">
            <ErrorIcon />
          </View>
        )}
      </View>
      {message && (
        <>
          <View className="h-[15]" />
          <CustomText
            type="caption1"
            text={message}
            className={`text-gray400 self-start pl-[9] ${
              isError ? 'text-red' : ''
            } ${isSuccess ? 'text-yellowPrimary' : ''}`}
          />
        </>
      )}
    </>
  );
};
