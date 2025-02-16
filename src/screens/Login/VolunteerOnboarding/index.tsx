import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {COLORS} from '@constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import {ValueOf} from 'react-native-gesture-handler/lib/typescript/typeUtils';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerOnboardingScreen'
>;

export type PageProps = {
  nickname?: string;
  onNext: () => void;
};

// 이미지 미리 로딩 함수
const preloadImages = async () => {
  const images = [
    require('@assets/pngs/background/volunteerOnboarding1.png'),
    require('@assets/pngs/background/volunteerOnboarding2.png'),
    require('@assets/pngs/background/volunteerOnboarding3.png'),
  ];

  await Promise.all(
    images.map(image => Image.prefetch(Image.resolveAssetSource(image).uri)),
  );
};

const Page1 = ({nickname, onNext}: Readonly<PageProps>) => {
  return (
    <View className="flex-1 items-center mt-[150]">
      <Txt
        type="body2"
        text={`${nickname} 님,\n이런 말 들어본 적 있나요?`}
        className="text-white text-center mb-[26]"
      />
      <Text
        className="text-yellow200 font-[Voltaire-Regular]"
        style={{fontSize: 48}}>
        “
      </Text>
      <Text
        className="text-yellow200 text-center font-[LeeSeoyun-Regular] mb-[26]"
        style={{fontSize: 25, lineHeight: 25 * 1.5}}>
        {'아이 하나를 키우는데\n온 동네가 필요하다'}
      </Text>
      <Text
        className="text-yellow200 font-[Voltaire-Regular]"
        style={{fontSize: 48}}>
        ”
      </Text>
      <Txt type="body2" text="라는 말이요" className="text-white text-center" />
      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button text="다음" onPress={onNext} />
      </View>
    </View>
  );
};

const Page2 = ({onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/volunteerOnboarding1.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={
            '내일모래는\n자립준비청년의 일상에\n따스한 목소리를 전하기 위해 만들어졌어요'
          }
          className="text-white text-center mt-[130]"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const Page3 = ({nickname, onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/volunteerOnboarding2.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={`${nickname} 님의 말 한마디에는\n자립준비청년의 일상을\n밝게 비출 힘이 있어요`}
          className="text-white text-center mt-[130]"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const Page4 = ({onNext}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/volunteerOnboarding3.png')}
      className="flex-1 items-center">
      <View className="flex-1 w-full">
        <Txt
          type="body2"
          text={
            '내일모래와 함께 내일도, 모레도,\n청년의 일상을 비추러 가볼래요?'
          }
          className="text-gray100 text-center mt-[130]"
        />
        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={onNext} />
        </View>
      </View>
    </ImageBackground>
  );
};

const VolunteerOnboardingScreen = ({navigation}: Readonly<AuthProps>) => {
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

  const handleSkip = () => {
    navigation.navigate('VolunteerNoticeScreen');
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

  const PAGE_COUNT = 4;
  const width = Dimensions.get('window').width;

  const pages = [
    <Page1 key="1" nickname={nickname} onNext={handleNext} />,
    <Page2 key="2" onNext={handleNext} />,
    <Page3 key="3" nickname={nickname} onNext={handleNext} />,
    <Page4 key="4" onNext={handleNext} />,
  ];

  return (
    <BG
      type={
        currentPageIdx === 2 || currentPageIdx === 3 ? 'gradation' : 'main'
      }>
      <>
        <AppBar skipCallbackFn={handleSkip} />

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

export default VolunteerOnboardingScreen;
