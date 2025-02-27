// API
import {getAlarmCategoryDetail} from '@apis/alarm';

// 아이콘
import CloseBlackIcon from '@assets/svgs/closeBlack.svg';
import FightingIcon from '@assets/svgs/emotion/emotion_fighting_gray.svg';
import ThumbIcon from '@assets/svgs/emotion/emotion_thumb_gray.svg';
import WaterIcon from '@assets/svgs/emotion/emotion_water_gray.svg';
import LogoIcon from '@assets/svgs/Main2.svg';
import SettingSmallIcon from '@assets/svgs/settingSmall.svg';

// 컴포넌트
import Txt from '@components/atom/Txt';

// 상수
import { COLORS } from '@constants/Colors';

// 훅
import useGetAlarmComfort from '@hooks/alarm/useGetAlarmComfort';
import useGetHelperNum from '@hooks/member/useGetHelperNum';

// 라이브러리
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YouthStackParamList} from '@stackNav/Youth';
import {useEffect, useRef, useState} from 'react';
import {Alert, Animated, ImageBackground, Pressable, View} from 'react-native';
import {StatusBar} from 'react-native';

type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthHomeScreen'
>;

const VOICE_MENU = [
  {
    alarmCategory: 'CONSOLATION',
    alarmCategoryKoreanName: '위로',
    icon: <FightingIcon />,
  },
  {
    alarmCategory: 'PRAISE',
    alarmCategoryKoreanName: '칭찬과 격려',
    icon: <ThumbIcon />,
  },
  {
    alarmCategory: 'SADNESS',
    alarmCategoryKoreanName: '우울과 불안',
    icon: <WaterIcon />,
  },
];

const YouthHomeScreen = ({navigation}: Readonly<YouthProps>) => {
  const [clicked, setClicked] = useState(false);
  const {data: helperNumData, isError: isHelperNumError} = useGetHelperNum();
  const [nickname, setNickname] = useState('');
  const {
    data: alarmComfortData,
    isError: isAlarmComfortError,
    error: alarmComfortError,
  } = useGetAlarmComfort();
  const animations = useRef(
    VOICE_MENU.map(() => new Animated.Value(0)),
  ).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  console.log('alarmComfortData', alarmComfortData);
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  const handleButtonClick = (alarmCategory: string) => {
    if (!alarmComfortData) {
      return;
    }

    const alarms = alarmComfortData.result.find(
      alarm => alarm.alarmCategory === alarmCategory,
    );
    console.log('children', alarms?.children);
    const childrenAlarmCategory = alarms?.children[0].alarmCategory;

    (async () => {
      if (!childrenAlarmCategory) {
        return;
      }

      try {
        const {result} = await getAlarmCategoryDetail({
          childrenAlarmCategory,
        });
        const {alarmId} = result;
        console.log('getAlarmCategory', result);
        navigation.navigate('YouthListenScreen', {
          alarmId,
        });
      } catch (error) {
        console.log(error);
        Alert.alert('오류', '위로 알람을 불러오는 중 오류가 발생했어요');
      }
    })();
  };

  useEffect(() => {
    if (isHelperNumError) {
      Alert.alert('오류', '조력자 수를 불러오는 중 오류가 발생했어요');
    }
  }, [isHelperNumError]);

  useEffect(() => {
    if (isAlarmComfortError) {
      console.log(alarmComfortError);
      Alert.alert('오류', '위로 알람을 불러오는 중 오류가 발생했어요');
    }
  }, [isAlarmComfortError, alarmComfortError]);

  const animateMenu = (toValue: number) => {
    const animationsArray = VOICE_MENU.map((_, index) =>
      Animated.timing(animations[index], {
        toValue,
        duration: 300,
        useNativeDriver: true,
        delay: index * 100,
      }),
    );
    Animated.stagger(
      100,
      toValue === 1 ? [...animationsArray].reverse() : animationsArray,
    ).start();
  };

  const handleMenuToggle = () => {
    setClicked(prev => !prev);
    animateMenu(clicked ? 0 : 1);
    Animated.timing(textOpacity, {
      toValue: clicked ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthMain.png')}
      className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.main200}
        translucent={false}
      />      
      <Pressable
        className="flex-row self-start items-center px-[30] pt-[32.5]"
        onPress={() => navigation.navigate('SystemStackNav')}>
        <SettingSmallIcon />
        <View className="w-[6.5]" />
        <Txt type="caption1" text="설정" className="text-blue200" />
      </Pressable>

      <Txt
        type="body2"
        text={`${nickname}님, 반가워요!`}
        className="text-gray300 pt-[60.5] px-[30]"
      />
      <View className="h-[12]" />
      <View className="px-[30]">
        <View className="flex-row items-center">
          <Txt
            type="title2"
            text={`${helperNumData?.result.youthMemberNum ?? '0'}명의 목소리`}
            className="text-yellowPrimary"
          />
          <Txt type="title2" text="가" className="text-white" />
        </View>
        <Txt
          type="title2"
          text="당신의 일상을 비추고 있어요"
          className="text-white"
        />
      </View>

      <Pressable
        className={`absolute items-end w-full h-full bg-black/50 ${
          clicked ? '' : 'hidden'
        }`}
        onPress={clicked ? handleMenuToggle : null}
      />

      <View className="absolute bottom-[90] right-[41] items-end">
        {VOICE_MENU.map(({alarmCategory, alarmCategoryKoreanName}, index) => (
          <Animated.View
            key={alarmCategory}
            style={{
              opacity: animations[index],
              transform: [
                {
                  translateY: animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
            className="flex-row items-center mb-[14]">
            <Txt
              type="button"
              text={alarmCategoryKoreanName}
              className="text-white"
            />
            <View className="w-[16]" />
            <Pressable
              className="bg-blue400 h-[61] w-[61] justify-center items-center active:bg-blue600"
              style={{borderRadius: 100}}
              onPress={() => handleButtonClick(alarmCategory)}
              disabled={!clicked}>
              {
                VOICE_MENU.find(menu => menu.alarmCategory === alarmCategory)
                  ?.icon
              }
            </Pressable>
          </Animated.View>
        ))}
        <View className="flex-row items-center">
          <Animated.View style={{opacity: textOpacity}}>
            {!clicked && (
              <Txt type="button" text="위로 받기" className="text-white" />
            )}
            {clicked && (
              <Txt type="button" text="위로 받기" className="text-white" />
            )}
          </Animated.View>
          <View className="w-[16]" />
          <Pressable
            className={`${
              clicked ? 'bg-yellowPrimary' : 'bg-blue500'
            } flex-row justify-center items-center h-[61] w-[61]`}
            style={{borderRadius: 100}}
            onPress={handleMenuToggle}>
            {clicked ? <CloseBlackIcon /> : <LogoIcon />}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default YouthHomeScreen;
