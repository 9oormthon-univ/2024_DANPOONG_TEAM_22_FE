import BG from '@components/atom/BG';
import Body2 from '@components/atom/body/Body2';
import Button from '@components/atom/button/Button';
import LeeSeoYunText from '@components/atom/LeeSeoyunText';
import VoltaireText from '@components/atom/VoltaireText';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@stackNav/Auth';
import { RootStackParamList } from '@type/RootStackParamList';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Animated, Dimensions, Image, View } from 'react-native';
import { SlidingDot } from 'react-native-animated-pagination-dots';
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerOnboardingScreen'
>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Page1 = ({ nickname }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Body2
        text={`${nickname ?? ''} 님,\n이런 말 들어본 적 있나요?`}
        className="text-white text-center"
      />
      <VoltaireText text="“" size={48} className="text-yellow200 mt-[26]" />
      <LeeSeoYunText
        text={`아이 하나를 키우는데\n온 동네가 필요하다`}
        size={25}
        className="text-yellow200 text-center"
      />
      <VoltaireText text="”" size={48} className="text-yellow200 mt-[26]" />
      <Body2 text="라는 말이요" className="text-white text-center" />
    </View>
  );
};

const Page2 = () => {
  return (
    <View className="flex-1 items-center mt-[80]">
      <Body2
        text={`홀로서기를 시작한\n자립준비청년은 마치\n사막을 걷는 나그네와 같아요`}
        className="text-gray200 text-center"
      />
      <Image
        source={require('../../../assets/images/login/background3.png')}
        className="w-full h-[466] absolute bottom-0"
      />
    </View>
  );
};

const Page3 = ({ nickname }) => {
  return (
    <View className="flex-1 items-center mt-[80]">
      <Body2
        text={`사막의 별처럼,\n${nickname ?? ''} 님의 목소리는\n나그네의 길을 안내할 수 있어요`}
        className="text-gray200 text-center"
      />
      <Image
        source={require('../../../assets/images/login/background1.png')}
        className="w-full h-auto"
      />
    </View>
  );
};

const Page4 = ({ handleNext }: Readonly<{ handleNext: () => void }>) => {
  return (
    <View className="flex-1 items-center mt-[80]">
      <Body2
        text={`내일모래와 함께\n내일도, 모레도,\n청년의 일상을 비추러 가볼래요?`}
        className="text-gray200 text-center "
      />
      <Image
        source={require('../../../assets/images/login/constellation.png')}
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

const VolunteerOnboardingScreen = ({ navigation }: Readonly<Props>) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const nickname = SecureStore.getItem('nickname');

  const handleNext = () => {
    navigation.navigate('AppTabNav');
  };

  const PAGE_COUNT = 4;
  const width = Dimensions.get('window').width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, PAGE_COUNT];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
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
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentPageIdx(e.nativeEvent.position);
  };

  return (
    <SafeAreaView className="flex-1">
      <BG type={currentPageIdx === 3 ? 'gradation' : 'main'}>
        <>
          <View className="justify-center items-center mt-[85]">
            <SlidingDot
              testID={'sliding-dot'}
              marginHorizontal={3}
              containerStyle={{ top: 30 }}
              data={INTRO_DATA}
              //@ts-ignore
              scrollX={scrollX}
              dotSize={5.926}
              dotStyle={{ backgroundColor: '#414141' }}
              slidingIndicatorStyle={{ backgroundColor: '#F9F96C' }}
            />
          </View>

          <AnimatedPagerView
            testID="pager-view"
            initialPage={0}
            ref={ref}
            className="flex-1"
            onPageScroll={onPageScroll}
            onPageSelected={onPageSelected}
          >
            <View key="1" className="flex-1">
              <Page1 nickname={nickname} />
            </View>
            <View key="2" className="flex-1">
              <Page2 />
            </View>
            <View key="3" className="flex-1">
              <Page3 nickname={nickname} />
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
