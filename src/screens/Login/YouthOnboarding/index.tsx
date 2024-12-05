import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, ImageBackground, View} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthOnboardingScreen'
>;

type PageProps = {
  nickname: string;
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Page1 = ({nickname}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/BGmain.png')}
      className="flex-1 items-center">
      <View className="flex-1 items-center mt-[189]">
        <Txt
          type="body1"
          text={'이곳은 광활한 사막...'}
          className="text-white text-center mb-[36]"
        />
        <Txt
          type="body2"
          text={`${nickname} 님,\n당신은 이곳을 여행하는 나그네군요.`}
          className="text-gray200 text-center"
        />
      </View>
    </ImageBackground>
  );
};

const Page2 = () => {
  return (
    <View className="flex-1 items-center mt-[189]">
      <Txt
        type="body2"
        text={
          '낯선 길을 걸으며 때로는 지치고,\n혼자라는 생각이 들 수 있을 거예요.'
        }
        className="text-gray200 text-center"
      />
      <Image
        source={require('@assets/pngs/background/background_youth2.png')}
        className="w-full h-auto mt-[143]"
      />
    </View>
  );
};

const Page3 = () => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/background_youth1.png')}
      className="flex-1 items-center">
      <View className="flex-1 items-center mt-[189]">
        <Txt
          type="body2"
          text={'내일모래에는\n당신의 위해 목소리를 내는\n별들이 있어요.'}
          className="text-gray200 text-center"
        />
      </View>
    </ImageBackground>
  );
};

const Page4 = () => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/background_youth3.png')}
      className="flex-1 items-center">
      <View className="flex-1 items-center mt-[189]">
        <Txt
          type="body2"
          text={'별들의 목소리는\n당신의 일상을 안내하고,\n위로 해줄 거예요.'}
          className="text-gray200 text-center"
        />
      </View>
    </ImageBackground>
  );
};

const Page5 = ({handleNext}: Readonly<{handleNext: () => void}>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/background_youth4.png')}
      className="flex-1 items-center">
      <View className="flex-1 items-center mt-[189]">
        <Txt
          type="body2"
          text={'내일모래에서\n내일도, 모레도,\n함께할 별들을 만나러 가볼래요?'}
          className="text-gray200 text-center"
        />
      </View>
      <View className="absolute left-0 bottom-[30] w-full px-[30]">
        <Button text="다음" onPress={handleNext} />
      </View>
    </ImageBackground>
  );
};

const YouthOnboardingScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role} = route.params;
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  // 상태바 스타일 설정
  const [BackColorType, setBackColorType] = useState<'gradation' | 'main'>('main');
  useStatusBarStyle(BackColorType);
  useEffect(()=>{
    setBackColorType(currentPageIdx === 3 || currentPageIdx === 4 ? 'gradation' : 'main');
  },[currentPageIdx])

  //
  const handleNext = () => {
    navigation.navigate('YouthMemberInfoWriteScreen', {
      nickname,
      imageUri,
      role,
    });
  };

  const PAGE_COUNT = 4;
  const width = Dimensions.get('window').width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, PAGE_COUNT];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, PAGE_COUNT * width],
  });

  const INTRO_DATA = [
    {
      key: '1',
      title: '',
      description: '',
    },
    {
      key: '2',
      title: '',
      description: '',
    },
    {
      key: '3',
      title: '',
      description: '',
    },
    {
      key: '4',
      title: '',
      description: '',
    },
    {
      key: '5',
      title: '',
      description: '',
    },
  ];

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentPageIdx(e.nativeEvent.position);
  };

  return (
    <SafeAreaView className="flex-1">
      <BG type={BackColorType}>

        <>
          <View className="justify-center items-center mt-[85]">
            <SlidingDot
              testID={'sliding-dot'}
              marginHorizontal={3}
              containerStyle={{top: 30}}
              data={INTRO_DATA}
              //@ts-ignore
              scrollX={scrollX}
              dotSize={5.926}
              dotStyle={{backgroundColor: '#414141'}}
              slidingIndicatorStyle={{backgroundColor: '#F9F96C'}}
            />
          </View>

          <AnimatedPagerView
            testID="pager-view"
            initialPage={0}
            ref={ref}
            className="flex-1"
            onPageScroll={onPageScroll}
            onPageSelected={onPageSelected}
            style={{marginTop: -85}}>
            <View key="1" className="flex-1">
              <Page1 nickname={nickname ?? ''} />
            </View>
            <View key="2" className="flex-1">
              <Page2 />
            </View>
            <View key="3" className="flex-1">
              <Page3 />
            </View>
            <View key="4" className="flex-1">
              <Page4 />
            </View>
            <View key="5" className="flex-1">
              <Page5 handleNext={handleNext} />
            </View>
          </AnimatedPagerView>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default YouthOnboardingScreen;
