// React Native 및 Navigation 관련 임포트
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {View} from 'react-native';

// 커스텀 컴포넌트 임포트
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {Button} from '@components/Button';
import {CustomText} from '@components/CustomText';

// SVG 아이콘 임포트
import Notice2 from '@assets/svgs/Notice2.svg';
import Notice3 from '@assets/svgs/Notice3.svg';
import Notice4 from '@assets/svgs/Notice4.svg';

// 타입 임포트
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {trackEvent} from '@utils/tracker';

export const RCDErrorScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDError'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {type, errorType} = route.params;

  return (
    <BG type="solid">
      {/* 상단 앱바 */}

      <AppBar
        title=""
        exitCallbackFn={() => {
          navigation.navigate('RCDList', {type: type});
          trackEvent('recording_rejected', {type, errorType});
        }}
        className="absolute top-[0] w-full"
      />
      {/* 메인 컨텐츠 */}
      <View className="flex-1 items-center justify-between mt-[65]">
        {/* 오류 메시지 섹션 */}
        <View className="absolute top-[194] items-center">
          {/* 오류 타입에 따른 아이콘 표시 */}
          {errorType === 'noisy' ? (
            <Notice2 />
          ) : errorType === 'bad' ? (
            <Notice2 />
          ) : errorType === 'wrong' ? (
            <Notice3 />
          ) : (
            <Notice4 />
          )}
          <View className="mt-[43]" />
          {/* 오류 메시지 제목 */}
          <CustomText            type="title2"
            text={
              errorType === 'noisy'
                ? '주변 소음이 크게 들려서\n녹음을 전송할 수 없어요'
                : errorType === 'bad'
                ? '부적절한 내용이\n포함되어 있어요'
                : errorType === 'wrong'
                ? '주제와 다른 내용이\n포함되어 있어요'
                : '준비한 문장을\n그대로 읽어주세요'
            }
            className="text-white text-center"
          />
          <View className="mt-[25]" />
          {/* 오류 메시지 부제목 */}
          <CustomText            type="body4"
            text={
              errorType === 'noisy'
                ? '조용한 장소에서 다시 녹음해주세요'
                : errorType === 'bad'
                ? '청년에게 위로와 힘이 되는 말을 해주세요'
                : '준비한 문장을 그대로 읽었을 때\n녹음이 전송될 수 있어요'
            }
            className="text-gray300 text-center"
          />
        </View>
        {/* 하단 버튼 섹션 */}
        <View className="px-px w-full absolute bottom-[50]">
          <Button
            text="다시 녹음하기"
            onPress={() => {
              navigation.goBack();
              trackEvent('recording_retry', {type, errorType});
            }}
            disabled={false}
          />
        </View>
      </View>
    </BG>
  );
};