// 커스텀 컴포넌트 import
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import AppBar from '@components/atom/AppBar';

// React Native 기본 컴포넌트 import
import {ActivityIndicator, Animated, ImageBackground, View} from 'react-native';

// React Navigation 관련 import
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';

// React Hooks import
import {useEffect, useRef, useState} from 'react';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
/**
 * RCD 피드백 화면 컴포넌트
 * 녹음 완료 후 로딩 및 완료 상태를 보여주는 화면
 */
const RCDFeedBackScreen = () => {
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 애니메이션 값 관리
  const opValue = useRef(new Animated.Value(0)).current;
  const subColor = useRef(new Animated.Value(0)).current;
  // 네비게이션 객체
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  // 상태바 스타일 설정
  const BackColorType = 'solid';
  useStatusBarStyle(BackColorType);

  // 로딩이 끝나면 애니메이션 시작
  useEffect(() => {
    if (!isLoading) {
      // 투명도 애니메이션
      Animated.timing(opValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // 색상 애니메이션
      Animated.timing(subColor, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isLoading]);

  // 서브텍스트 색상 보간 값이 0일 때는 #a0a0a0, 1일 때는 #d0d0d0
  const interpolatedColor = subColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a0a0a0', '#d0d0d0'],
  });

  return (
    <View className="flex-1">
      {isLoading ? (
        <>
          {/* 로딩 화면 */}
          <BG type="solid">
            {/* 콘텐츠 섹션 */}
            <View className="absolute pt-[233] w-full">
              <Txt
                type="title1"
                text="듣고 있어요..."
                className="text-gray_100 text-center"
              />
              <View className="mb-[23]" />
              <Animated.Text
                className="text-center"
                style={{color: interpolatedColor}}>
                더 세심한 확인이 필요할 때는{'\n'}시간이 조금 더 소요될 수
                있어요
              </Animated.Text>
              <View className="mb-[55]" />
              <ActivityIndicator size="large" color="#f9f96c" />
            </View>
          </BG>
        </>
      ) : (
        <>
          {/* 배경 섹션 - 불꺼진 배경에서 불 켜진 배경으로 애니메이션 효과 */}
          {/* 불 꺼진 배경 - 기본 상태 */}
          <BG type="solid">
            <View className="w-full h-full justify-center items-center">
              <View className="w-[90%] h-[85%] justify-center items-center">
                <ImageBackground
                  source={require('@assets/webps/starsOff.webp')}
                  resizeMode="contain"
                  className="static w-full h-full"
                />
              </View>
            </View>
          </BG>
          {/* 불 켜진 배경 - 애니메이션 효과 */}
          <Animated.View
            className="absolute w-full h-full justify-center items-center"
            style={{opacity: opValue}}>
            <BG type="gradation">
              <View className="w-full h-full justify-center items-center">
                <View className="w-[90%] h-[85%] justify-center items-center">
                  <ImageBackground
                    source={require('@assets/webps/starsOn.webp')}
                    resizeMode="contain"
                    className="w-full h-full"
                  />
                </View>
              </View>
            </BG>
          </Animated.View>
          {/* 상단 앱바 섹션 */}
          <AppBar
            title=""
            exitCallbackFn={() => {
              navigation.navigate('Home');
            }}
            className="absolute top-[0] w-full"
          />

          {/* 콘텐츠 섹션 - 메인 텍스트 */}
          <View className="absolute pt-[292] w-full">
            <Txt
              type="title1"
              text="녹음 완료"
              className="text-white text-center"
            />
            <View className="mb-[23]" />
            <Animated.Text
              className="text-center"
              style={{
                color: interpolatedColor,
                fontFamily: 'WantedSans-Regular',
                fontSize: 18,
                lineHeight: 18 * 1.5,
                letterSpacing: 18 * -0.025,
              }}>
              바람돌이님의 목소리 덕분에{'\n'}나그네가 힘차게 여행할 수
              있을거에요
            </Animated.Text>
          </View>
        </>
      )}
    </View>
  );
};

export default RCDFeedBackScreen;
