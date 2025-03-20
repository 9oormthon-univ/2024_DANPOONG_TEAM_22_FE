import LogoIcon from '@assets/svgs/splash/splash_logo.svg';
import TextIcon from '@assets/svgs/splash/splash_text.svg';
import {BG} from '@components/BG';
import {View} from 'react-native';

export const SplashScreen = () => {
  return (
    <BG type="main">
      <View className="flex-1 justify-center items-center">
        <LogoIcon />
        <View className="absolute bottom-[95]">
          <TextIcon />
        </View>
      </View>
    </BG>
  );
};
