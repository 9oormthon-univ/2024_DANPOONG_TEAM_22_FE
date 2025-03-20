import { useEffect, useRef } from 'react';
import { View, TouchableWithoutFeedback, Animated } from 'react-native';
import { COLORS } from '@constants/Colors';

type ToggleSwitchProps ={
  isOn: boolean;
  onToggle: () => void;
}

export const ToggleSwitch = ({ 
  isOn,
  onToggle,
}: ToggleSwitchProps) => {
  // 초기값을 isOn 상태에 따라 0 또는 1로 설정
  const animation = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,  // layout 관련 속성 애니메이션이므로 false
    }).start();
  }, [isOn]);

  // 토글 버튼 내 원의 이동 (off일 때 0, on일 때 22px)
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <View 
        className="w-[51] h-[29] rounded-full justify-center p-[2]"
        style={{ backgroundColor: isOn ? COLORS.yellowPrimary : COLORS.gray400 }}
      >
        <Animated.View 
          className="w-[25] h-[25] rounded-full bg-white"
          style={{ transform: [{ translateX }] }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

