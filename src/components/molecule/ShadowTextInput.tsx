import {TextInput as RNTextInput, TouchableOpacity, View} from 'react-native';
import {useRef, useState} from 'react';
import ShadowView from '@components/atom/ShadowView';

interface ShadowTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isError?: boolean;
  height?: number;
}

const ShadowTextInput = ({
  value,
  onChangeText,
  placeholder = "텍스트를 입력해주세요",
  isError = false,
  height = 340,
}: ShadowTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<RNTextInput>(null);

  return (
    <View
      className={`flex-1 w-full h-[${height}] rounded-card border-[1px] border-transparent ${
        isFocused && 'border-gray300'
      } ${isError && 'border-[#f13a1e] bg-error'}`}>
      <ShadowView>
        <RNTextInput
          ref={textInputRef}
          onChangeText={onChangeText}
          value={value}
          style={{
            fontFamily: 'WantedSans-Regular',
            fontSize: 20,
            lineHeight: 30,
            letterSpacing: 20 * -0.025,
            color: '#fafafa',
          }}
          className={'w-full h-auto p-[33] '}
          placeholder={placeholder}
          placeholderTextColor="#a0a0a0"
          autoCapitalize="none"
          cursorColor="#fafafa"
          multiline
          textAlign="left"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}
          className="flex-1"
        />
      </ShadowView>
    </View>
  );
};

export default ShadowTextInput; 