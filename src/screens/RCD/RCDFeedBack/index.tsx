// 커스텀 컴포넌트 import
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import AppBar from '@components/atom/AppBar';

// React Native 기본 컴포넌트 import
import {Animated, ImageBackground, ImageSourcePropType, View} from 'react-native';

// React Navigation 관련 import
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';

// React Hooks import
import {useEffect, useRef} from 'react';
import StatusBarGap from '@components/atom/StatusBarGap';
/**
 * RCD 피드백 화면 컴포넌트
 * 녹음 완료 후 로딩 및 완료 상태를 보여주는 화면
 */
const RCDFeedBackScreen = () => {
  // 애니메이션 값 관리
  const opValue = useRef(new Animated.Value(0)).current;
  const subColor = useRef(new Animated.Value(0)).current;
  // 네비게이션 객체
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  // 로딩이 끝나면 애니메이션 시작
  useEffect(() => {
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
  }, []);

  // 서브텍스트 색상 보간 값이 0일 때는 #a0a0a0, 1일 때는 #d0d0d0
  const interpolatedColor = subColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a0a0a0', '#d0d0d0'],
  });

  // ImageBackground 컴포넌트를 렌더링하는 함수
  const RenderImageBackground = ({isOn}: {isOn: boolean}) => (
    <BG type={isOn ? 'gradation' : 'solid'}>

      <StatusBarGap />
      <View className="w-full h-full justify-center items-center">
        <View className="w-[90%] h-[85%] justify-center items-center">
        <ImageBackground
        source={isOn ? require('@assets/webps/starsOn.webp') : require('@assets/webps/starsOff.webp')}
        resizeMode="contain"
          className="w-full h-full"
        />
      </View>
      </View>
    </BG>
  );

  return (
    <View className="flex-1">
          {/* 배경 섹션 - 불꺼진 배경에서 불 켜진 배경으로 애니메이션 효과 */}
          {/* 불 꺼진 배경 - 기본 상태 */}
          <RenderImageBackground isOn={false} />
          {/* 불 켜진 배경 - 애니메이션 효과 */}
          <Animated.View
            className="absolute w-full h-full justify-center items-center"
            style={{opacity: opValue}}>
            <RenderImageBackground isOn={true} />
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
    </View>
  );
};

export default RCDFeedBackScreen;
