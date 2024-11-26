import BG from '@components/atom/BG';
import Body3 from '@components/atom/body/Body3';
import Title2 from '@components/atom/title/Title2';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoadingScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <BG type="solid">
        <View className="flex-1 justify-center items-center">
          <View className="absolute top-[-100] w-full h-full">
            <LottieView
              style={{
                flex: 1,
              }}
              source={require('../../../assets/lottie/loadingDots.json')}
              autoPlay
              loop
            />
          </View>
          <Body3 text="잠시만 기다려주세요" className="text-gray300 mt-[65] mb-[28]" />
          <Title2 text={`따스한 마음을 담은\n목소리를 준비 중이에요.`} className="text-white text-center" />
        </View>
      </BG>
    </SafeAreaView>
  );
};

export default LoadingScreen;
