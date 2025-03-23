import {CustomText} from '@components/CustomText';
import LottieView from 'lottie-react-native';
import {Pressable, TextStyle, ViewStyle} from 'react-native';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export const Button = ({
  text,
  onPress,
  disabled,
  isLoading,
  containerStyle,
  textStyle,
}: Readonly<ButtonProps>) => {
  return (
    <Pressable
      className={`h-[57] justify-center items-center flex-row ${
        disabled ? 'bg-gray300' : 'bg-yellowPrimary'
      }`}
      style={[{borderRadius: 10}, containerStyle]}
      onPress={onPress}
      disabled={disabled}>
      {isLoading ? (
        <LottieView
          style={{
            width: 240,
            height: 240,
          }}
          source={require('@assets/lottie/loadingDots.json')}
          autoPlay
          loop
        />
      ) : (
        <CustomText
          type="button"
          text={text}
          className={`${disabled ? 'text-white bg-gray300' : 'text-black'}`}
          style={textStyle}
        />
      )}
    </Pressable>
  );
};
