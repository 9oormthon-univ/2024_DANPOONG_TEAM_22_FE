// React Native 및 Navigation 관련 임포트
import {View, ScrollView} from 'react-native';
// 커스텀 컴포넌트 임포트
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
// SVG 아이콘 임포트
import Notice1 from '@assets/svgs/Notice1.svg';
import Notice2 from '@assets/svgs/Notice2.svg';
// 타입 임포트
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import AppBar from '@components/atom/AppBar';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';

/**
 * 주의사항 섹션 컴포넌트
 * @param seq - 섹션 순서 번호
 * @param title - 섹션 제목
 * @param content - 섹션 내용
 */
const Section = ({
  seq,
  title,
  content,
}: {
  seq: number;
  title: string;
  content: string;
}) => {
  
  return (
    <View className="w-full h-auto mt-[37]">
      {seq === 1 ? <Notice1 /> : <Notice2 />}
      <View className="mt-[20]" />
      <Txt type="title4" text={title} className="text-yellowPrimary" />
      <View className="mt-[10]" />
      <Txt type="body4" text={content} className="text-gray200" />
    </View>
  );
};

/**
 * 녹음 전 주의사항 화면 컴포넌트
 * 녹음 시 유의해야 할 사항들을 안내하는 화면
 */
const RCDNoticeScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDNotice'>;
}) => {
  // 상태바 스타일 설정
  const BackColorType = 'solid';
  useStatusBarStyle(BackColorType);
  
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {item, type} = route.params;
  return (
    <BG type={BackColorType}>
      {/* 상단 앱바 */}
      <AppBar
        title="주의 사항"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <ScrollView className="flex-1 px-px mt-[64]">
        <View className="flex-1">
          {/* 헤더 섹션 */}
          <View className="mt-[63]" />
          <Txt
            type="title2"
            text={'녹음 전에,\n꼭 확인해주세요!'}
            className="text-white"
          />
          {/* 주의사항 섹션 */}
          <Section
            seq={1}
            title="부적절한 말은 삼가 주세요"
            content="욕설, 인종 차별적인 말, 정치적 갈등을 조장하는 말, 성적·성차별적인 말, 타인을 비하하는 말 등 불쾌감을 주거나 부적절하다고 판단되는 말이 감지되었을 시, 녹음 전송이 거부될 수 있어요."
          />
          <Section
            seq={2}
            title="조용한 장소에서 녹음해 주세요"
            content="카페, 길거리, 공원 등 주변 소음이 있는 곳에서는 녹음 품질이 저하될 수 있어요. 최상의 녹음 품질을 위해 실내의 조용한 공간에 녹음 하시기를 권장드려요."
          />
        </View>
        {/* 하단 버튼 섹션 */}
        <View className="mt-[43] mb-mb">
          <Button
            text="확인했어요"
            disabled={false}
            onPress={() => {
              navigation.navigate('RCDSelectText', {type, item});
            }}
          />
        </View>
      </ScrollView>
    </BG>
  );
};

export default RCDNoticeScreen;
