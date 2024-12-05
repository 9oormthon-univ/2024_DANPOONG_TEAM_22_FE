import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import {SafeAreaView} from 'react-native-safe-area-context';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerOnboardingScreen'
>;

type PageProps = {
  nickname: string;
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Page1 = ({nickname}: Readonly<PageProps>) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Txt
        type="body2"
        text={`${nickname ?? ''} 님,\n이런 말 들어본 적 있나요?`}
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
    </View>
  );
};

const Page2 = () => {
  return (
    <View className="flex-1 items-center mt-[189]">
      <Txt
        type="body2"
        text={
          '홀로서기를 시작한\n자립준비청년은 마치\n사막을 걷는 나그네와 같아요'
        }
        className="text-gray200 text-center"
      />
      <Image
        source={require('@assets/pngs/background/background3.png')}
        className="w-full h-auto mt-[173]"
      />
    </View>
  );
};

const Page3 = ({nickname}: Readonly<PageProps>) => {
  return (
    <View className="flex-1 items-center mt-[189]">
      <Txt
        type="body2"
        text={`사막의 별처럼,\n${
          nickname ?? ''
        } 님의 목소리는\n나그네의 길을 안내할 수 있어요`}
        className="text-gray200 text-center"
      />
      <Image
        source={require('@assets/pngs/background/background1.png')}
        className="w-full h-auto mt-[234]"
      />
    </View>
  );
};

const Page4 = ({handleNext}: Readonly<{handleNext: () => void}>) => {
  return (
    <View className="flex-1 items-center mt-[189]">
      <Txt
        type="body2"
        text={
          '내일모래와 함께\n내일도, 모레도,\n청년의 일상을 비추러 가볼래요?'
        }
        className="text-gray200 text-center "
      />
      <Image
        source={require('@assets/pngs/marginalStars.png')}
        width={274}
        height={269.5}
        className="w-[300] h-auto absolute bottom-[30]"
      />
      <Image
        source={require('@assets/pngs/constellation.png')}
        width={274}
        height={269.5}
        className="w-[274] h-[269.5] mt-[100]"
      />
      <View className="absolute left-0 bottom-[30] w-full px-[30]">
        <Button text="다음" onPress={handleNext} />
      </View>
    </View>
  );
};

const VolunteerOnboardingScreen = ({navigation}: Readonly<AuthProps>) => {

  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [nickname, setNickname] = useState('');

  // 상태바 스타일 설정
  const [BackColorType, setBackColorType] = useState<'gradation' | 'main'>('main');
  useEffect(()=>{
    setBackColorType(currentPageIdx === 3 ? 'gradation' : 'main');
  },[currentPageIdx])
  useStatusBarStyle(BackColorType);

  // 닉네임 가져오기
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  const handleNext = () => {
    navigation.navigate('VolunteerNoticeScreen');
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
      title: 'App showcase ✨',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      key: '2',
      title: 'Introduction screen 🎉',
      description:
        "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
    },
    {
      key: '3',
      title: 'And can be anything 🎈',
      description:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
    },
    {
      key: '4',
      title: 'And can be anything 🎈',
      description:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
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
              <Page3 nickname={nickname ?? ''} />
            </View>
            <View key="4" className="flex-1">
              <Page4 handleNext={handleNext} />
            </View>
          </AnimatedPagerView>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default VolunteerOnboardingScreen;
