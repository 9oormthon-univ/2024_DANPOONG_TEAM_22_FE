import LogoRoundIcon from '@assets/svgs/logoRound.svg';
import {BG} from '@components/BG';
import {Button} from '@components/Button';
import {SkipBar} from '@components/SkipBar';
import {CustomText} from '@components/CustomText';
import {COLORS} from '@constants/Colors';
import {VOICE_DELAY_MS} from '@constants/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PageProps} from '@screens/Login/VolunteerOnboarding';
import {AuthStackParamList} from '@stackNav/Auth';
import {trackEvent} from '@utils/tracker';
import LottieView from 'lottie-react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {ValueOf} from 'react-native-gesture-handler/lib/typescript/typeUtils';
import {PanGestureHandlerEventPayload} from 'react-native-screens';

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
  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  const handleNext = () => {
    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('onboarding_viewtime', {
      step: '3.1',
      view_time: viewTime, // 밀리초 단위
    });

    onNext();
  };

  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthOnboarding1.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <View className="h-[200]" />
        <CustomText          type="body2"
          text={`${nickname} 님,\n지금도 내일모래에는\n당신을 위해 목소리를 내는\n사람들이 있어요`}
          className="text-white text-center"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={handleNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const Page2 = ({
  nickname,
  onNext,
  jumpStep,
}: Readonly<PageProps & {jumpStep: () => void}>) => {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;

  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  const trackViewTime = () => {
    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('onboarding_viewtime', {
      step: '3.2 & 3.3',
      view_time: viewTime, // 밀리초 단위
    });
  };

  const handleNext = () => {
    trackViewTime();

    trackEvent('push_demo_click');

    onNext();
  };

  const handleJump = () => {
    trackViewTime();
    jumpStep();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textColorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const textColor = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.white, COLORS.gray300], // white to gray
  });

  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthOnboarding2.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <View className="h-[200]" />
        <Animated.Text
          style={{
            color: textColor,
          }}>
          <CustomText            type="body2"
            text={`이제부터 이들의 목소리가\n${nickname} 님의 일상 곳곳에 도착할 거예요`}
            className="text-center"
          />
        </Animated.Text>

        <Animated.View style={{opacity: contentOpacity}}>
          <CustomText            type="body2"
            text="이렇게요"
            className="text-white text-center mt-[55]"
          />

          <View className="h-[32]" />

          <View className="px-[30]">
            <Pressable
              className="border border-yellow200 bg-white10 h-[84] flex-row items-center px-[15]"
              style={{
                borderRadius: 10,
                shadowColor: 'rgba(253, 253, 196, 0.30)',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 33, // Android only
              }}
              onPress={handleNext}>
              <LogoRoundIcon />
              <View className="pl-[10]">
                <CustomText type="body4" text="내일모래" className="text-white" />
                <View className="h-[3]" />
                <CustomText                  type="caption3"
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
              className="h-[43] bg-yellow200 justify-center items-center px-[20]"
              style={{borderRadius: 100}}>
              <CustomText                type="caption2"
                text="누르면, 실제 봉사자의 목소리 알림을 들을 수 있어요"
                className="text-black"
              />
            </View>
          </View>
        </Animated.View>

        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={handleJump} />
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
    }, VOICE_DELAY_MS);

    return () => {
      (async () => {
        await audioPlayer.current.stopPlayer();
      })();
    };
  }, []);

  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  const handleNext = () => {
    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('onboarding_viewtime', {
      step: '3.3.1',
      view_time: viewTime, // 밀리초 단위
    });

    trackEvent('push_demo_listen', {
      view_time: viewTime, // 밀리초 단위
    });

    onNext();
  };

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
        <CustomText type="title4" text="네잎클로바" className="text-yellowPrimary" />
      </View>

      <View className="h-[33] " />

      <View className="px-[30]">
        <CustomText          type="title3"
          text={`아침 거르고 빈속으로 있으면 힘들어.\n아침에 뭐라도 먹어야 에너지가 생기지.\n꼭 가볍게라도 챙겨 먹어!`}
          className="text-gray200"
        />
      </View>

      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button text="다음" onPress={handleNext} />
      </View>
    </View>
  );
};

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const Page4 = ({onNext}: Readonly<PageProps>) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const nextOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nextOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  const handleNext = () => {
    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('onboarding_viewtime', {
      step: '3.4',
      view_time: viewTime, // 밀리초 단위
    });

    onNext();
  };

  return (
    <View className="flex-1 items-center">
      <AnimatedImageBackground
        source={require('@assets/pngs/background/youthOnboarding3.png')}
        style={{...StyleSheet.absoluteFillObject, opacity: opacityAnim}}>
        <View className="flex-1 w-full">
          <View className="h-[200]" />
          <CustomText            type="body2"
            text={`이제부터 내일모래가 내일도, 모레도,\n당신의 일상에 따스한 목소리를 전달해줄게요`}
            className="text-white text-center"
          />
          <View className="absolute left-0 bottom-[55] w-full px-[30]">
            <Button text="다음" onPress={handleNext} />
          </View>
        </View>
      </AnimatedImageBackground>
      <AnimatedImageBackground
        source={require('@assets/pngs/background/youthOnboarding4.png')}
        style={{...StyleSheet.absoluteFillObject, opacity: nextOpacityAnim}}>
        <View className="flex-1 w-full">
          <View className="h-[200]" />
          <CustomText            type="body2"
            text={`이제부터 내일모래가 내일도, 모레도,\n당신의 일상에 따스한 목소리를 전달해줄게요`}
            className="text-white text-center"
          />
          <View className="absolute left-0 bottom-[55] w-full px-[30]">
            <Button text="다음" onPress={handleNext} />
          </View>
        </View>
      </AnimatedImageBackground>
    </View>
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

  const trackSkipEvent = () => {
    let step = '';
    if (currentPageIdx === 0) {
      step = '3.1';
    } else if (currentPageIdx === 1) {
      step = '3.2 & 3.3';
    } else if (currentPageIdx === 2) {
      step = '3.3.1';
    } else if (currentPageIdx === 3) {
      step = '3.4';
    }

    trackEvent('onboarding_skip_click', {
      step,
    });
  };

  const handleSkip = () => {
    navigation.navigate('YouthWakeUpTimeScreen');
    setCurrentPageIdx(0);
  };

  const handleNext = () => {
    if (currentPageIdx === PAGE_COUNT - 1) {
      handleSkip();
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

  const handlePrevious = () => {
    if (currentPageIdx === 0) return;
    // 페이드 아웃 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPageIdx(prevIdx => prevIdx - 1);
      // 페이드 인 애니메이션
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSwipe = ({
    nativeEvent,
  }: {
    nativeEvent: PanGestureHandlerEventPayload & {state: ValueOf<typeof State>};
  }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -50) {
        // Swipe left
        handleNext();
      } else if (nativeEvent.translationX > 50) {
        // Swipe right
        handlePrevious();
      }
    }
  };

  const handleJumpStep = () => {
    if (currentPageIdx === PAGE_COUNT - 1) {
      handleSkip();
      return;
    }
    // 페이드 아웃 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPageIdx(prevIdx => prevIdx + 2); // 여기만 다름
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
    <Page2
      key="2"
      nickname={nickname}
      onNext={handleNext}
      jumpStep={handleJumpStep}
    />,
    <Page3 key="3" onNext={handleNext} />,
    <Page4 key="4" onNext={handleNext} />,
  ];

  const canJumpPageIdx = 2;

  return (
    <BG type="main">
      <>
        {currentPageIdx !== canJumpPageIdx && (
          <>
            <View className="absolute top-0 left-0 w-full z-10">
              <SkipBar
                onSkip={() => {
                  handleSkip();
                  trackSkipEvent();
                }}
              />
            </View>

            <View className="absolute top-[100] left-1/2 -translate-x-1/2">
              <SlidingDot
                marginHorizontal={6}
                containerStyle={{top: 30}}
                data={Array(PAGE_COUNT - 1).fill({})}
                scrollX={
                  new Animated.Value(
                    (currentPageIdx === PAGE_COUNT - 1
                      ? currentPageIdx - 1
                      : currentPageIdx) * width,
                  )
                }
                dotSize={5.926}
                dotStyle={{backgroundColor: COLORS.gray400, zIndex: 10}}
                slidingIndicatorStyle={{backgroundColor: COLORS.yellowPrimary}}
              />
            </View>
          </>
        )}

        <View className="flex-1">
          <PanGestureHandler onHandlerStateChange={handleSwipe}>
            <Animated.View style={{flex: 1, opacity: fadeAnim}}>
              {pages[currentPageIdx]}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </>
    </BG>
  );
};

export {YouthOnboardingScreen};
