import React, { useEffect, useRef, useState } from 'react';
import { Animated, type ViewStyle } from 'react-native';

type AnimatedViewProps = {
  visible: boolean;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
};

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  visible,
  children,
  className,
  style,
}) => {
  const [shouldRender, setShouldRender] = useState(visible);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true); // 먼저 보여주고 애니메이션 시작

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false); // 애니메이션 끝난 후 숨기기
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
        style,
      ]}
      className={className}>
      {children}
    </Animated.View>
  );
};
