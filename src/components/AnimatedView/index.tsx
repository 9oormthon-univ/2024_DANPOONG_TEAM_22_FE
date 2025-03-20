import React, {useRef, useEffect} from 'react';
import {Animated, ViewStyle} from 'react-native';

type AnimatedViewProps = {
  visible: boolean;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  visible,
  children,
  className,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
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
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{translateY: translateYAnim}],
        },
        style,
      ]}
      className={className}>
      {children}
    </Animated.View>
  );
};

