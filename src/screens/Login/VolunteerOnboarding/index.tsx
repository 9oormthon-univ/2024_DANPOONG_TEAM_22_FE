import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerOnboardingScreen'
>;

type PageProps = {
  nickname: string;
};

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
        source={require('@assets/webps/marginalStars.webp')}
        width={274}
        height={269.5}
        className="w-[300] h-auto absolute bottom-[30]"
      />
      <Image
        source={require('@assets/webps/constellation.webp')}
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
  const [fadeAnim] = useState(new Animated.Value(1));

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

  const pages = [
    <Page1 key="1" nickname={nickname ?? ''} />,
    <Page2 key="2" />,
    <Page3 key="3" nickname={nickname ?? ''} />,
    <Page4 key="4" handleNext={handleNext} />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPageIdx < PAGE_COUNT - 1) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000, // 페이드아웃 시간
          useNativeDriver: true,
        }).start(() => {
          setCurrentPageIdx(prevIdx => prevIdx + 1);
          fadeAnim.setValue(0);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // 페이드인 시간
            useNativeDriver: true,
          }).start();
        });
      } else {
        clearInterval(interval);
      }
    }, 2500); // 페이지 전환 간격 (페이드아웃 + 페이드인 시간 포함)

    return () => clearInterval(interval);
  }, [currentPageIdx, fadeAnim]);

  return (
    <BG type={currentPageIdx === 3 ? 'gradation' : 'main'}>
      <>
        <View className="justify-center items-center mt-[85]">
          <SlidingDot
            marginHorizontal={3}
            containerStyle={{top: 30}}
            data={Array(PAGE_COUNT).fill({})}
            scrollX={new Animated.Value(currentPageIdx * width)}
            dotSize={5.926}
            dotStyle={{backgroundColor: '#414141'}}
            slidingIndicatorStyle={{backgroundColor: '#F9F96C'}}
          />
        </View>

        <View style={{flex: 1}}>
          <Animated.View
            style={{...StyleSheet.absoluteFillObject, opacity: fadeAnim}}>
            {pages[currentPageIdx]}
          </Animated.View>
        </View>
      </>
    </BG>
  );
};

export default VolunteerOnboardingScreen;
