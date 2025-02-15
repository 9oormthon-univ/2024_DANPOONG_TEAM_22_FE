import {TextInput as RNTextInput, View} from 'react-native';
import {useRef} from 'react';
import {COLORS} from '@constants/Colors';
import ErrorIcon from '@assets/svgs/TextInputError.svg';
interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isError: boolean;
}

const TextInput = ({
  value,
  onChangeText,
  placeholder = "텍스트를 입력해주세요",
  isError = false,
}: TextInputProps) => {
  const textInputRef = useRef<RNTextInput>(null);

  return (
    <View
      className={`flex-row h-[60px] items-center justify-between w-full rounded-lg border-[1px] border-gray300 bg-[#fafafa1a]`}>
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
        {isError && <View className='m-[16px]'><ErrorIcon /></View>}
    </View>
  );
};

export default TextInput; 