import Txt from '@components/atom/Txt';
import LottieView from 'lottie-react-native';
import {Pressable} from 'react-native';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const Button = ({
  text,
  onPress,
  disabled,
  isLoading,
}: Readonly<ButtonProps>) => {
  return (
    <Pressable
      className={`h-[57] justify-center items-center flex-row ${
        disabled ? 'bg-gray300' : 'bg-yellowPrimary'
      }`}
      style={{borderRadius: 10}}
      onPress={onPress}
      disabled={disabled}>
      {isLoading ? (
        <LottieView
          style={{
            flex: 1,
          }}
          source={require('../../../assets/lottie/loadingDots.json')}
          autoPlay
          loop
        />
      ) : (
        <Txt
          type="button"
          text={text}
          className={`${disabled ? 'text-white bg-gray300' : 'text-black'}`}
        />
      )}
    </Pressable>
  );
};

export default Button;
