// 커스텀 컴포넌트 import
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {CustomText} from '@components/CustomText';

// React Native 기본 컴포넌트 import
import {Animated, ImageBackground, View} from 'react-native';

// React Navigation 관련 import
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';

// React Hooks import
import AsyncStorage from '@react-native-async-storage/async-storage';
import {trackEvent} from '@utils/tracker';
import {useEffect, useRef, useState} from 'react';

//  RCD 피드백 화면 컴포넌트 녹음 완료 후 로딩 및 완료 상태를 보여주는 화면
export const RCDFeedBackScreen = () => {
  const [nickname, setNickname] = useState('');
  // 애니메이션 값 관리
  const opValue = useRef(new Animated.Value(0)).current;
  // 네비게이션 객체
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);
  // 로딩이 끝나면 애니메이션 시작
  useEffect(() => {
    // 투명도 애니메이션
    Animated.timing(opValue, {
      toValue: 1 ,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [ opValue]);

  return (
   <BG type='solid'>
    <AppBar
        title=""
        exitCallbackFn={() => {
          navigation.navigate('Home');
          trackEvent('recording_complete');
        }}
        className="w-full"
      />
      {/* off 상태 */}
      <View className='flex-1'>
        {/* 배경 섹션 */}
        <ImageBackground  source={ require('@assets/webps/starsOff.webp') }
            resizeMode="contain"
            className="w-full h-full"
          />
        {/* 콘텐츠 섹션 */}
        <View className="absolute top-[33%] w-full">
        <CustomText          type="title1"
          text="녹음 완료"
          className="text-white text-center"
        />
        <View className="mb-[23]" />
        <CustomText 
        type='body3' 
        text={`${nickname}님의 목소리 덕분에\n나그네가 힘차게 여행할 수 있을거예요`}
        className='text-[#a0a0a0] text-center'/>
      </View>
      </View>
      {/* on 상태 */}
      <Animated.View
        className="absolute top-[64] left-0 right-0 bottom-0 flex-1 justify-center items-center"

        style={{opacity: opValue}}>
         {/* 배경 섹션 */}
         <ImageBackground  source={ require('@assets/webps/starsOn.webp') }
            resizeMode="contain"
            className="w-full h-full"
          />
        {/* 콘텐츠 섹션 */}
        <View className="absolute top-[33%] w-full">
        <CustomText          type="title1"
          text="녹음 완료"
          className="text-white text-center"
        />
        <View className="mb-[23]" />
        <CustomText 
        type='body3' 
        text={`${nickname}님의 목소리 덕분에\n나그네가 힘차게 여행할 수 있을거예요`}
        className='text-[#d0d0d0] text-center'/>
      </View>
      </Animated.View>
   </BG>
  );
};


