// React Native 및 Navigation 관련 임포트
import { View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// 커스텀 컴포넌트 임포트
import BG from '@components/atom/BG';
import AppBar from '@components/atom/AppBar';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';

// SVG 아이콘 임포트
import Notice1 from '@assets/svgs/Notice1.svg';
import Notice2 from '@assets/svgs/Notice2.svg';

// 타입 임포트
import { HomeStackParamList } from '@type/nav/HomeStackParamList';
  /**
 * 녹음 오류 화면 컴포넌트
 * @param route - 라우트 객체 (오류 타입 정보 포함)
 */
const RCDErrorScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDError'>;
}) => {

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {type,message} = route.params;

  return (
    <BG type="solid">
      {/* 상단 앱바 */}

      <AppBar
        title=""
        exitCallbackFn={() => {
          navigation.goBack();
    }}
    className="absolute top-[0] w-full"
  />
  {/* 메인 컨텐츠 */}
  <View className="flex-1 items-center justify-between mt-[65]">
    {/* 오류 메시지 섹션 */}
    <View className="absolute top-[194] items-center">
      {/* 오류 타입에 따른 아이콘 표시 */}
      {/* {type === 'bad' ? <Notice1 /> : <Notice2 />} */}
      <Notice1 />
      <View className="mt-[43]" />
      {/* 오류 메시지 제목 */}
      <Txt
        type="title2"
        text={message}
        className="text-white text-center"
      />
      <View className="mt-[25]" />
      {/* 오류 메시지 부제목 */}
      <Txt
        type="body4"
        text={
          '다시 녹음해 주시겠어요?'
        }
        className="text-gray300 text-center"
      />
    </View>
    {/* 하단 버튼 섹션 */}
    <View className="px-px w-full absolute bottom-[50]">
      <Button
        text="다시 녹음하기"
        onPress={() => {
          // 부적절한 표현일 경우 홈으로, 그 외에는 이전 화면으로
          // if (type === 'bad') {
          //   navigation.navigate('Home');
          // } else {
          //   navigation.goBack();
          // }
          navigation.goBack();
        }}
        disabled={false}
      />
    </View>
      </View>
    </BG>
  );
};

export default RCDErrorScreen;
