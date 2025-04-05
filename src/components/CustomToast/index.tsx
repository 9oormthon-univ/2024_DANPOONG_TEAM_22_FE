import { Animated, Dimensions, View } from 'react-native';
import { type ToastConfigParams } from 'react-native-toast-message';

import { CustomText } from '@components/CustomText';

import Bang from '@assets/svgs/Bang.svg';
import CheckYellowIcon from '@assets/svgs/checkYellow.svg';

export type CustomToastType = 'check' | 'notice' | 'text';

export type CustomToastPosition = 'top' | 'left' | 'bottom';

type Props = {
  type: CustomToastType;
  position: CustomToastPosition;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * react-native-toast-message 에서 사용하는 커스텀 토스트 컴포넌트
 */
export const CustomToast = ({ text1, props }: ToastConfigParams<Props>) => {
  const { type, position } = props;

  return (
    <View
      className={`w-full items-center justify-center absolute ${
        position === 'top'
          ? 'top-[100] px-[30]'
          : position === 'left'
          ? 'top-[88] left-[25] items-start'
          : 'px-[30]'
      }`}
      style={{ bottom: position === 'bottom' ? -SCREEN_HEIGHT + 89 : null }}>
      <Animated.View
        className="w-auto h-auto flex-row bg-blue400 px-[25] py-[16] z-50"
        style={{
          borderRadius: 50,
        }}>
        {type === 'check' ? (
          <CheckYellowIcon />
        ) : type === 'notice' ? (
          <Bang />
        ) : null}
        {type !== 'text' && <View className="w-[14]" />}
        <CustomText
          type="body4"
          text={text1 ?? ''}
          className="text-white text-center"
        />
      </Animated.View>
    </View>
  );
};
