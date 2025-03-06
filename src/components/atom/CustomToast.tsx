import Bang from '@assets/svgs/Bang.svg';
import CheckYellowIcon from '@assets/svgs/checkYellow.svg';
import Txt from '@components/atom/Txt';
import {Animated, View} from 'react-native';

const CustomToast = ({text1, props}: any) => {
  const {type, position} = props;

  return (
    <View
      className={`w-full items-center justify-center absolute ${
        position === 'top'
          ? 'top-[100]'
          : position === 'left'
          ? 'top-[88] left-[25] items-start'
          : 'bottom-[89] '
      }`}>
      <Animated.View
        className="w-auto h-auto flex-row bg-blue400 px-[25] py-[16] z-50"
        style={{
          borderRadius: 50,
        }}>
        {type === 'check' ? <CheckYellowIcon /> : <Bang />}
        <View className="ml-[14]" />
        <Txt type="body4" text={text1} className="text-white text-center" />
      </Animated.View>
    </View>
  );
};

export default CustomToast;
