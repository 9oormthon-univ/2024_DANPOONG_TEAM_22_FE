import {View, Animated} from 'react-native';
import Txt from '@components/atom/Txt';
import Bang from '@assets/svgs/Bang.svg';
import {useEffect} from 'react';

const Toast = ({
  text,
  isToast,
  setIsToast,
}: {
  text: string;
  isToast: boolean;
  setIsToast: () => void;
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (isToast) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        setIsToast();
      }, 1250);

      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
    }
  }, [isToast]);

  if (!isToast) {
    return null;
  }

  return (
    <View className="w-full items-center justify-center absolute top-[150] ">
      <Animated.View
        className="w-auto h-auto flex-row bg-tabIcon px-[27] py-[16] z-50"
        style={{
          borderRadius: 50,
          opacity,
        }}>
        <Bang />
        <View className="ml-[14]" />
        <Txt type="body4" text={text} className="text-white text-center" />
      </Animated.View>
    </View>
  );
};
export default Toast;
