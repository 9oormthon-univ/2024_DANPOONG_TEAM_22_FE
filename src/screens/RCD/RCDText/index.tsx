// React Native 및 기본 컴포넌트 import
import {View} from 'react-native';
// 커스텀 컴포넌트 import
import {postVoicefilesAlarmIdSelf} from '@apis/RCDApis/postVoicefilesAlarmIdSelf';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import StarIMG from '@components/atom/StarIMG';
import Toast from '@components/atom/Toast';
import Txt from '@components/atom/Txt';
import ShadowTextInput from '@components/molecule/ShadowTextInput';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {trackEvent} from '@utils/tracker';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';

//   RCD 텍스트 입력 화면 컴포넌트
const RCDTextScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDText'>;
}) => {
  // 라우트 파라미터 추출
  const {item, gptRes, alarmId, type} = route.params;
  // 상태 관리
  const [text, setText] = useState(''); // 텍스트 입력값
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>(); // 네비게이션
  const [isError, setIsError] = useState(false); // 에러 상태
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [errorMessage, setErrorMessage] = useState('부적절한 언어가 있어요'); // 에러 메시지
  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  // 초기 마운트 시 GPT 응답 내용으로 텍스트 설정
  useEffect(() => {
    setText(gptRes?.result.content || '');
  }, []);

  // 텍스트 변경 핸들러
  const onChangeText = (text: string) => {
    setText(text);
  };

  /**
   * 스크립트 제출 핸들러
   * 스크립트를 저장하고 녹음 화면으로 이동
   */
  const scriptSubmitHandler = async () => {
    try {
      setIsLoading(true);
      const content: string = text;
      console.log('content', content);
      const res = await postVoicefilesAlarmIdSelf(alarmId, content);

      if (res.code && res.code === 'ANALYSIS200') {
        setErrorMessage('주제와 다른 내용이 있어요');
        setIsError(true);
        setIsToast(true);
        return;
      }

      if (res.code && res.code === 'ANALYSIS201') {
        setErrorMessage('부적절한 언어가 있어요');
        setIsError(true);
        setIsToast(true);
        return;
      }

      const voiceFileId = res.result.voiceFileId;
      navigation.navigate('RCDRecord', {
        type,
        voiceFileId,
        content,
      });

      const endTime = new Date().getTime();
      const viewTime = endTime - startTime.current;

      trackEvent('script_edit_time', {
        type,
        alarmCategory: item.alarmCategory,
        koreanName: item.koreanName,
        title: item.title,
        view_time: viewTime,
        content: content,
      });
    } catch (e) {
      setIsError(true);
      setIsToast(true);
      console.log('스크립트 저장 오류:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BG type="solid">
      {/* 상단 앱바 */}
      <AppBar
        title="녹음 내용 작성"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      {/* 에러 토스트 메시지 */}
      <Toast
        text={errorMessage}
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
      />
      {/* 메인 스크롤 영역 */}
      <ScrollView
        className="w-full h-full px-px mt-[65] pt-[52]"
        contentContainerStyle={{alignItems: 'center'}}>
        {/* 이미지 섹션 */}
        <StarIMG />
        <View className="mb-[29]" />
        {/* 헤더 섹션 */}
        <View className="h-auto items-center mb-[50]">
          <Txt
            type="title2"
            text={item.title}
            className="text-white text-center"
          />
        </View>
        {/* 텍스트 입력 섹션 */}
        <ShadowTextInput
          value={text}
          onChangeText={onChangeText}
          placeholder={`${
            type === 'DAILY' ? '15' : '30'
          }초 동안 녹음할 말을 작성해주세요`}
          isError={isError}
          maxLength={type === 'DAILY' ? 150 : 300}
        />
        <View className="mb-[51]" />

        {/* 버튼 섹션 */}
        <View className="w-full mb-[78]">
          <Button
            text="녹음하기"
            onPress={scriptSubmitHandler}
            disabled={text.length === 0 || isLoading}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </BG>
  );
};

export default RCDTextScreen;
