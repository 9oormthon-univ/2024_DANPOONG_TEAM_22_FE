// React Native 및 기본 컴포넌트 임포트
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// API 관련 임포트
import { postVoicefilesSelfByAlarmId } from '@apis/VolunteerRecord/post/VoicefilesSelfByAlarmId/fetch';
// 커스텀 컴포넌트 임포트
import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { Button } from '@components/Button';
import { CustomText } from '@components/CustomText';
// 네비게이션 관련 임포트
import { DismissKeyboardView } from '@components/DismissKeyboardView';
// 유틸리티 임포트
import { FlexableMargin } from '@components/FlexableMargin';
import { ShadowView } from '@components/ShadowView';
import { StarIMG } from '@components/StarIMG';
import { Toast } from '@components/Toast';
import {
  type NavigationProp,
  type RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { type HomeStackParamList } from '@type/nav/HomeStackParamList';
import { trackEvent } from '@utils/tracker';

//   RCD 텍스트 입력 화면 컴포넌트
export const RCDTextScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDText'>;
}) => {
  // 라우트 파라미터 추출
  const { item, gptRes, alarmId, type } = route.params;
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

      const res = await postVoicefilesSelfByAlarmId(alarmId, content);

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
      <DismissKeyboardView>
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
        <FlexableMargin flexGrow={130} />
        {/* 이미지 섹션 */}
        <View className="items-center">
          <StarIMG />
        </View>
        <FlexableMargin flexGrow={29} />
        {/* 헤더 섹션 */}
        <View className="h-auto items-center">
          <CustomText
            type="title2"
            text={item.title}
            className="text-white text-center"
          />
        </View>
        <FlexableMargin flexGrow={50} />
        {/* 텍스트 입력 섹션 */}
        <View className="px-px w-full h-[340]">
          <ShadowTextInput
            value={text}
            onChangeText={onChangeText}
            placeholder={`${
              type === 'DAILY' ? '15' : '30'
            }초 동안 녹음할 말을 작성해주세요`}
            isError={isError}
            maxLength={type === 'DAILY' ? 150 : 300}
          />
        </View>
        <FlexableMargin flexGrow={51} />

        {/* 버튼 섹션 */}
        <View className="w-full px-px">
          <Button
            text="녹음하기"
            onPress={scriptSubmitHandler}
            disabled={text.length === 0 || isLoading}
            isLoading={isLoading}
          />
        </View>
        <FlexableMargin flexGrow={Platform.OS === 'ios' ? 79 : 55} />
      </DismissKeyboardView>
    </BG>
  );
};

type ShadowTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isError?: boolean;
  height?: number;
  maxLength?: number;
};

const ShadowTextInput = ({
  value,
  onChangeText,
  placeholder = '텍스트를 입력해주세요',
  isError = false,
  maxLength = 150,
}: ShadowTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<RNTextInput>(null);

  return (
    <View
      className={`flex-1 w-full h-[340px] rounded-card border-[1px] border-transparent ${
        isFocused && 'border-gray300'
      } ${isError && 'border-red  bg-red/5'}`}>
      <ShadowView>
        <RNTextInput
          ref={textInputRef}
          onChangeText={onChangeText}
          value={value}
          style={{
            fontFamily: 'WantedSans-Regular',
            fontSize: 20,
            lineHeight: 30,
            letterSpacing: 20 * -0.025,
            color: '#fafafa',
            textAlignVertical: 'top',
          }}
          className={'w-full h-auto px-[33] py-[30] bg-transparent'}
          placeholder={placeholder}
          placeholderTextColor="#a0a0a0"
          autoCapitalize="none"
          cursorColor="#fafafa"
          multiline
          textAlign="left"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />
        <TouchableOpacity
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}
          className="flex-1 bg-transparent"
        />
      </ShadowView>
    </View>
  );
};
