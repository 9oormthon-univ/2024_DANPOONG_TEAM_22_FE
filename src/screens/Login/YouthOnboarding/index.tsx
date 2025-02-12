import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {COLORS} from '@constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PageProps} from '@screens/Login/VolunteerOnboarding';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  View,
} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';
import LogoRoundIcon from '@assets/svgs/logoRound.svg';
import LottieView from 'lottie-react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthOnboardingScreen'
>;

// 이미지 미리 로딩 함수
const preloadImages = async () => {
  const images = [
    require('@assets/pngs/background/youthOnboarding1.png'),
    require('@assets/pngs/background/youthOnboarding2.png'),
    require('@assets/pngs/background/youthOnboarding3.png'),
    require('@assets/pngs/background/youthOnboarding4.png'),
  ];

  await Promise.all(
    images.map(image => Image.prefetch(Image.resolveAssetSource(image).uri)),
  );
};

const Page1 = ({nickname, onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthOnboarding1.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={`${nickname} 님,\n지금도 내일모래에는\n당신을 위해 목소리를 내는\n사람들이 있어요`}
          className="text-gray200 text-center mt-[200]"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const Page2 = ({nickname, onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthOnboarding2.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={`이제부터 이들의 목소리가\n${nickname} 님의 일상 곳곳에 도착할 거예요`}
          className="text-gray200 text-center mt-[200]"
        />

        <View>
          <Txt
            type="body2"
            text="이렇게요"
            className="text-white text-center mt-[55]"
          />

          <View className="h-[32]" />

          <View className="px-[30]">
            <Pressable
              className="border border-yellow200 bg-white10 shadow-[0px_0px_15px_0px_rgba(253,253,196,0.30)] h-[84] flex-row items-center px-[17]"
              style={{borderRadius: 10}}>
              <LogoRoundIcon />
              <View className="w-[16.81]" />
              <View>
                <Txt type="body4" text="내일모래" className="text-white" />
                <View className="h-[3]" />
                <Txt
                  type="caption2"
                  text="외출할 일이 있나요? 나가기 전에, 잠깐 들어봐요."
                  className="text-gray200"
                />
              </View>
            </Pressable>
          </View>

          <View className="h-[21]" />

          <View className="items-center">
            <View className="w-0 h-0 border-l-[5.5px] border-r-[5.5px] border-b-[11px] border-l-transparent border-r-transparent border-b-yellow200" />
            <View
              className="w-[301] h-[43] bg-yellow200 justify-center items-center"
              style={{borderRadius: 100}}>
              <Txt
                type="caption2"
                text="누르면, 실제 봉사자의 목소리 알림을 들을 수 있어요"
                className="text-black"
              />
            </View>
          </View>
        </View>

        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const Page3 = ({onNext}: Readonly<PageProps>) => {
  const animation = useRef<LottieView>(null); // 애니메이션 ref
  const audioPlayer = useRef(new AudioRecorderPlayer()); // 오디오 플레이어 ref
  const mockFileUrl =
    'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/mom.mp4';

  // 애니메이션 재생/정지 처리
  useEffect(() => {
    animation.current?.play();

    setTimeout(async () => {
      await audioPlayer.current.startPlayer(mockFileUrl);
    }, 2000);

    return () => {
      (async () => {
        await audioPlayer.current.stopPlayer();
      })();
    };
  }, []);

  return (
    <View className="flex-1 w-full ">
      <View
        className="absolute left-0 bottom-0 w-full h-full"
        style={{transform: [{scale: 1.1}]}}>
        <LottieView
          ref={animation}
          style={{
            flex: 1,
          }}
          source={require('@assets/lottie/voice.json')}
          autoPlay
          loop
        />
      </View>

      <View className="h-[130] " />

      <View className="flex-row items-center px-[30]">
        <View className="relative w-[31] h-[31] justify-center items-center">
          <Image
            source={require('@assets/pngs/logo/app/app_logo_yellow.png')}
            className="w-[25] h-[25]"
            style={{borderRadius: 25}}
          />
          <View
            className="absolute left-0 bottom-0 w-[31] h-[31] border border-yellowPrimary"
            style={{borderRadius: 31}}
          />
        </View>
        <View className="w-[10]" />
        <Txt type="title4" text="네잎클로바" className="text-yellowPrimary" />
      </View>

      <View className="h-[33] " />

      <View className="px-[30]">
        <Txt
          type="title3"
          text={`오늘 밖에 비가 온대.\n꼭 우산을 챙겨서 나가렴.\n오늘도 힘내!`}
          className="text-gray200"
        />
      </View>

      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button text="다음" onPress={onNext} />
      </View>
    </View>
  );
};

const Page4 = ({onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthOnboarding3.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={`이제부터 내일모래가 내일도, 모레도,\n당신의 일상에 따스한 목소리를 전달해줄게요`}
          className="text-gray200 text-center mt-[200]"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const YouthOnboardingScreen = ({navigation}: Readonly<AuthProps>) => {
  const [nickname, setNickname] = useState('');
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 닉네임 가져오기
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  // 이미지 미리 로딩
  useEffect(() => {
    preloadImages();
  }, []);

  const goNext = () => {
    navigation.navigate('YouthWakeUpTimeScreen');
    setCurrentPageIdx(0);
  };

  const handleNext = () => {
    if (currentPageIdx === PAGE_COUNT - 1) {
      goNext();
      return;
    }
    // 페이드 아웃 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPageIdx(prevIdx => prevIdx + 1);
      // 페이드 인 애니메이션
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const PAGE_COUNT = 4;
  const width = Dimensions.get('window').width;

  const pages = [
    <Page1 key="1" nickname={nickname} onNext={handleNext} />,
    <Page2 key="2" nickname={nickname} onNext={handleNext} />,
    <Page3 key="3" onNext={handleNext} />,
    <Page4 key="4" onNext={handleNext} />,
  ];

  return (
    <BG type="main">
      <>
        {currentPageIdx !== 2 && (
          <>
            <Pressable
              className="absolute top-[42] right-[22] z-10"
              onPress={goNext}>
              <Txt type="button" text="건너뛰기" className="text-white" />
            </Pressable>

            <View className="absolute top-[100] left-1/2 -translate-x-1/2">
              <SlidingDot
                marginHorizontal={6}
                containerStyle={{top: 30}}
                data={Array(PAGE_COUNT).fill({})}
                scrollX={new Animated.Value(currentPageIdx * width)}
                dotSize={5.926}
                dotStyle={{backgroundColor: COLORS.gray400, zIndex: 10}}
                slidingIndicatorStyle={{backgroundColor: COLORS.yellowPrimary}}
              />
            </View>
          </>
        )}

        <View className="flex-1">
          <Animated.View style={{flex: 1, opacity: fadeAnim}}>
            {pages[currentPageIdx]}
          </Animated.View>
        </View>
      </>
    </BG>
  );
};

export default YouthOnboardingScreen;
