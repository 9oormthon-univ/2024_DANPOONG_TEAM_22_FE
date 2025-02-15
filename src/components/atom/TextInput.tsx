// 필요한 컴포넌트 및 타입 import
import {TextInput as RNTextInput, View} from 'react-native';
import {useRef} from 'react';
import {COLORS} from '@constants/Colors';
import ErrorIcon from '@assets/svgs/TextInputError.svg';

// TextInput 컴포넌트의 props 타입 정의
interface TextInputProps {
  value: string; // 입력값
  onChangeText: (text: string) => void; // 텍스트 변경 핸들러
  placeholder?: string; // placeholder 텍스트 (선택)
  isError: boolean; // 에러 상태
  height?: number; // 높이 (선택) 선택안하면 한줄짜리가 됩니다.
}

// TextInput 컴포넌트
const TextInput = ({
  value,
  onChangeText,
  placeholder = "텍스트를 입력해주세요", // 기본값 설정
  isError = false, // 기본값 설정
  height = 60, // 기본값 설정
}: TextInputProps) => {
  // TextInput 레퍼런스 생성
  const textInputRef = useRef<RNTextInput>(null);

  return (
    // 컨테이너 View
    <View
      className={`flex-row h-[${height}px] items-center justify-between w-full rounded-lg border-[1px] border-gray300 bg-[#fafafa1a]`}>
        {/* 텍스트 입력 필드 */}
        <RNTextInput
          ref={textInputRef}
          onChangeText={onChangeText}
          value={value}
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
        />
        {/* 에러 상태일 때만 에러 아이콘 표시 */}
        {isError && <View className='m-[16px]'><ErrorIcon /></View>}
    </View>
  );
};

export default TextInput;