import {Image, View} from 'react-native';
import TopStarSVG from '@assets/svgs/TopStar.svg';

export const StarIMG = () => {
  return (
    <View className="relative w-[24] h-[24] justify-center items-center">
      <Image
        source={require('@assets/webps/TopStarBlur.webp')}
      />
      <View className="absolute">
        <TopStarSVG />
      </View>
    </View>
  );
};
