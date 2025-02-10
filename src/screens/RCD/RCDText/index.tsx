// React Native 및 기본 컴포넌트 import
import {TextInput, TouchableOpacity, View} from 'react-native';
// 커스텀 컴포넌트 import
import BG from '@components/atom/BG';
import StarIMG from '@components/atom/StarIMG';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import ShadowView from '@components/atom/ShadowView';
import {useState, useRef, useEffect} from 'react';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {ScrollView} from 'react-native-gesture-handler';
import {postSaveScript} from '@apis/RCDApis/postSaveScript';
import Toast from '@components/atom/Toast';
import AppBar from '@components/atom/AppBar';
import StatusBarGap from '@components/atom/StatusBarGap';
/**
 * RCD 텍스트 입력 화면 컴포넌트
 * @param route - 네비게이션 라우트 파라미터
 */
const RCDTextScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDText'>;
}) => {

  // 라우트 파라미터 추출
  const {item, gptRes, alarmId, type} = route.params;
  
  // 상태 관리
  const [text, setText] = useState(''); // 텍스트 입력값
  const textInputRef = useRef<TextInput>(null); // 텍스트 입력 ref
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>(); // 네비게이션
  const [isFocused, setIsFocused] = useState(false); // 입력창 포커스 상태
  const [isError, setIsError] = useState(false); // 에러 상태
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

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
      const res = await postSaveScript(alarmId, content);
      const voiceFileId = res.result.voiceFileId;
      navigation.navigate('RCDRecord', {
        type,
        voiceFileId,
        content,
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
        text="부적절한 언어가 감지되어 녹음할 수 없어요"
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
      />
      {/* 메인 스크롤 영역 */}
      <ScrollView
        className="w-full h-full px-px mt-[65] pt-[52]"
        contentContainerStyle={{alignItems: 'center'}}>
        <StatusBarGap />
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
        <View
          className={`flex-1 w-full h-[340] mb-[51] rounded-card border-[1px] border-transparent ${
            isFocused && 'border-gray300'
          } ${isError && 'border-[#f13a1e] bg-error'}`}>
          <ShadowView>
            <TextInput
              ref={textInputRef}
              onChangeText={onChangeText}
              value={text}
              style={{
                fontFamily: 'WantedSans-Regular',
                fontSize: 20,
                lineHeight: 30,
                letterSpacing: 20 * -0.025,
                color: '#fafafa',
              }}
              className={'w-full h-auto p-[33]'}
              placeholder="15초 동안 녹음할 말을 작성해주세요"
              placeholderTextColor="#a0a0a0"
              autoCapitalize="none"
              cursorColor="#fafafa"
              multiline
              textAlign="left"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {/* 입력창 터치 영역 확장 */}
            <TouchableOpacity
              onPress={() => {
                if (textInputRef.current) {
                  textInputRef.current.focus();
                }
              }}
              className="flex-1"
            />
          </ShadowView>
        </View>
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
