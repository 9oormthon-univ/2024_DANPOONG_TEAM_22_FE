import ErrorIcon from '@assets/svgs/TextInputError.svg';
import {CustomText} from '@components/CustomText';
import {COLORS} from '@constants/Colors';
import {useRef, useState} from 'react';
import {TextInput as RNTextInput, View} from 'react-native';

type TextInputProps ={
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isError?: boolean;
  isSuccess?: boolean;
  message?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

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
        className={`flex-row h-auto items-center justify-between w-full rounded-lg border-[1px] border-gray300 ${
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
          className={'flex-1 py-[16px] px-[24px]'}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray300}
          autoCapitalize="none"
          cursorColor={COLORS.white}
          multiline
          textAlign="left"
          maxLength={maxLength}
        />
        {isError && (
          <View className="m-[16px]">
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

