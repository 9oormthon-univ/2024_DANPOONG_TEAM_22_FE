import {BG} from '@components/BG';
import {CustomText} from '@components/CustomText';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
export const LoadingScreen = () => {

  return (
      <BG type="main">
        <View className="flex-1 justify-center items-center">
          <View className="absolute top-[-100] w-full h-full">
            <LottieView
              style={{
                flex: 1,
              }}
              source={require('@assets/lottie/loadingDots.json')}
              autoPlay
              loop
            />
          </View>
          <CustomText            type="body3"
            text="잠시만 기다려주세요"
            className="text-gray300 mt-[65] mb-[28]"
          />
          <CustomText            type="title2"
            text={'따스한 마음을 담은\n목소리를 준비 중이에요.'}
            className="text-white text-center"
      />
    </View>
  </BG>
  );
};