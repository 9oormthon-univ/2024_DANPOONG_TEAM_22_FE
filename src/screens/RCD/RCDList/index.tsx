// React Native 기본 컴포넌트 import
import {
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

// 커스텀 컴포넌트 import
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import Carousel from '@components/molecule/Carousel';
import AppBar from '@components/atom/AppBar';
import StatusBarGap from '@components/atom/StatusBarGap';
// React Navigation 관련 import
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';

// 타입 및 상수 import
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {getRCDList, RCD} from '@apis/RCDApis/getRCDList';
import {RecordType} from '@type/RecordType';
import {RCDListHeader} from '@constants/RCDListHeader';
import {RCDListAppBar} from '@constants/RCDListAppBar';
import {COLORS} from '@constants/Colors';
import {RecordTypeConstant} from '@constants/RecordType';
// React Hooks import
import {useState, useEffect} from 'react';
/**
 * RCD 목록을 보여주는 스크린 컴포넌트
 * @param route - 네비게이션 라우트 파라미터 (RCD 타입 정보 포함)
 */
const RCDListScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDList'>;
}) => {
  // 라우트에서 RCD 타입 추출
  const {type} = route.params;

  // 상태 관리
  const [rcdList, setRcdList] = useState<RCD[]>([]); // RCD 목록 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  
  // 네비게이션 객체
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  // RCD 목록 데이터 가져오기
  useEffect(() => {
    const fetchRCDList = async () => {
      const categoryType: RecordType = type;
      try {
        setIsLoading(true);
        const data = await getRCDList(categoryType);
        setRcdList(data);
        setIsLoading(false);
      } catch (error) {
        console.log('RCD 목록을 가져오는데 실패했습니다:', error);
        setRcdList([]); // 에러 발생 시 빈 배열로 초기화
      } 
    };

    fetchRCDList();
  }, [type]);

  return (
    <BG type="gradation">
      {/* 상단 앱바 */}
      <AppBar
        title={RCDListAppBar[type]}
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <StatusBarGap  />


      {/* 상단 배경 이미지 */}
      <ImageBackground
        source={
          type === RecordTypeConstant.INFO
            ? require('@assets/webps/BGStarTopINFO.webp')
            : require('@assets/webps/BGStarTop.webp')
        }
        style={{
          position: 'absolute',
          top: 130,
          right: type === RecordTypeConstant.INFO ? 31 : 0,
          width: type === RecordTypeConstant.INFO ? 338 : 161,
          height: type === RecordTypeConstant.INFO ? 53 : 130,
        }}
      />
      
      {/* 하단 배경 이미지 - RCD 타입에 따라 다른 이미지 사용 */}
      <ImageBackground
        source={
          type === RecordTypeConstant.DAILY
            ? require('@assets/pngs/BGStarBottomDAILY.png')
            : type === RecordTypeConstant.COMFORT
            ? require('@assets/pngs/BGStarBottomCOMFORT.png')
            : require('@assets/pngs/BGStarBottomINFO.png')
        }
        style={{position: 'absolute', bottom: 0, width: '100%', height: 258}}
      />
      
      {/* 헤더 섹션 */}
      <View className="w-full mt-[132] px-px mb-[33]">
        <Txt
          type="title2"
          text={RCDListHeader[type]}
          className="text-white"
        />
      </View>
      
      {/* RCD 목록 섹션 - 로딩 중이면 로딩 인디케이터 표시, 아니면 캐러셀 표시 */}
      {isLoading ? (
        <View className="h-[40vh] justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      ) : (
        <Carousel entries={rcdList} type={type} />
      )}
    </BG>
  );
};

export default RCDListScreen;
