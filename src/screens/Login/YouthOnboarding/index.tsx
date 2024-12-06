import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  View,
  StyleSheet,
} from 'react-native';
import {SlidingDot} from 'react-native-animated-pagination-dots';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthOnboardingScreen'
>;

type PageProps = {
  nickname: string;
};

const Page1 = ({nickname}: Readonly<PageProps>) => {
  return (
    <ImageBackground
      source={require('@assets/pngs/background/background_youth6.png')}
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
      className="flex-1 items-center mt-[-60]">
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
      className="flex-1 items-center mt-[-60]">
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
    <View className="flex-1 items-center mt-[189]">
      <Txt
        type="body2"
        text={'내일모래에서\n내일도, 모레도,\n함께할 별들을 만나러 가볼래요?'}
        className="text-gray200 text-center"
      />
      <Image
        source={require('@assets/pngs/background/background_youth9.png')}
        className="mt-[-60]"
      />
      <View className="absolute left-0 bottom-[30] w-full px-[30]">
        <Button text="다음" onPress={handleNext} />
      </View>
    </View>
  );
};

const YouthOnboardingScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role} = route.params;
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleNext = () => {
    navigation.navigate('YouthMemberInfoWriteScreen', {
      nickname,
      imageUri,
      role,
    });
  };

  const PAGE_COUNT = 5;
  const width = Dimensions.get('window').width;

  const pages = [
    <Page1 key="1" nickname={nickname ?? ''} />,
    <Page2 key="2" />,
    <Page3 key="3" />,
    <Page4 key="4" />,
    <Page5 key="5" handleNext={handleNext} />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPageIdx < PAGE_COUNT - 1) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700, // 페이드아웃 시간
          useNativeDriver: true,
        }).start(() => {
          setCurrentPageIdx(prevIdx => prevIdx + 1);
          fadeAnim.setValue(0);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700, // 페이드인 시간
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
    <BG
      type={
        currentPageIdx === 3 || currentPageIdx === 4 ? 'gradation' : 'main'
      }>
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

        <View className="flex-1">
          <Animated.View
            style={{...StyleSheet.absoluteFillObject, opacity: fadeAnim}}>
            {pages[currentPageIdx]}
          </Animated.View>
        </View>
      </>
    </BG>
  );
};

export default YouthOnboardingScreen;
