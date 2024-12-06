// 필요한 API 및 컴포넌트 import
import {getVoiceFiles} from '@apis/voiceFile';
import AppBar from '@components/atom/AppBar';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LoadingScreen from '@screens/Loading';
import {YouthStackParamList} from '@stackNav/Youth';
import {VoiceFileResponseData} from '@type/api/voiceFile';
import LottieView from 'lottie-react-native';
import {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {SafeAreaView} from 'react-native-safe-area-context';

// 아이콘 import
import FightingIcon from '@assets/svgs/emotion/emotion_fighting.svg';
import LoveIcon from '@assets/svgs/emotion/emotion_love.svg';
import StarIcon from '@assets/svgs/emotion/emotion_star.svg';
import ThumbIcon from '@assets/svgs/emotion/emotion_thumb.svg';
import PlayIcon from '@assets/svgs/play_youth.svg';
import SendIcon from '@assets/svgs/send.svg';
import SmileIcon from '@assets/svgs/smile.svg';
import SmileWhiteIcon from '@assets/svgs/smile_white.svg';
import StopIcon from '@assets/svgs/stop.svg';
import {postComment} from '@apis/providedFile';

// 네비게이션 Props 타입 정의
type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthListenScreen'
>;

// 감정 표현 옵션 상수
export const EMOTION_OPTIONS = [
  {icon: <StarIcon />, label: '고마워요', value: 'THANK_YOU'},
  {icon: <ThumbIcon />, label: '응원해요', value: 'HELPFUL'},
  {icon: <FightingIcon />, label: '화이팅', value: 'MOTIVATED'},
  {icon: <LoveIcon />, label: '사랑해요', value: 'LOVE'},
];

// 청년 리스닝 화면 컴포넌트
const YouthListenScreen = ({route, navigation}: Readonly<YouthProps>) => {
  // route params에서 필요한 값 추출
  const {alarmId, script} = route.params;

  // 상태 관리
  const [message, setMessage] = useState(''); // 메시지 입력값
  const [isClickedEmotion, setIsClickedEmotion] = useState(false); // 감정 표현 클릭 여부
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // 키보드 표시 여부
  const imageUri = null; // 프로필 이미지 URI
  const animation = useRef<LottieView>(null); // 애니메이션 ref
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 재생 여부
  const [voiceFile, setVoiceFile] = useState<VoiceFileResponseData>({} as VoiceFileResponseData); // 음성 파일 데이터
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const audioPlayer = useRef(new AudioRecorderPlayer()); // 오디오 플레이어 ref

  // 초기 로딩 처리
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 애니메이션 재생/정지 처리
  useEffect(() => {
    if (isPlaying) {
      animation.current?.play();
    } else {
      animation.current?.pause();
    }
  }, [isPlaying]);

  // 키보드 이벤트 리스너 설정
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // 음성 파일 로드 및 재생
  useEffect(() => {
    (async () => {
      if (!alarmId) {
        return;
      }
      try {
        const res = await getVoiceFiles({alarmId});
        console.log(res);
        setVoiceFile(res.result);
        await audioPlayer.current.startPlayer(res.result.fileUrl);
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
        // Alert.alert('오류', '음성 파일을 불러오는 중 오류가 발생했어요');
        setTimeout(async () => {
          await audioPlayer.current.startPlayer(
            'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/mom.mp4',
          );
          setIsPlaying(true);
        }, 1000);
      }
    })();

    return () => {
      if (isPlaying) {
        audioPlayer.current.stopPlayer();
      }
    };
  }, []);

  // 메시지 전송 처리
  const handleMessageSend = async () => {
    try {
      await postComment({providedFileId: voiceFile.providedFileId, message});
      Alert.alert('성공', '편지를 성공적으로 보냈어요');
      setMessage('');
    } catch (error) {
      console.log(error);
      // Alert.alert('오류', '편지를 보내는 중 오류가 발생했어요');
    }
  };

  // 재생/정지 버튼 클릭 처리
  const handlePlayButtonClick = async () => {
    try {
      if (isPlaying) {
        await audioPlayer.current.stopPlayer();
        setIsPlaying(false);
      } else {
        await audioPlayer.current.startPlayer(voiceFile.fileUrl);
        setIsPlaying(true);
      }
    } catch (error) {
      console.log(error);
      // Alert.alert('오류', '오디오 재생 중 오류가 발생했어요');
    }
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 메인 UI 렌더링
  return (
    <SafeAreaView className="flex-1 bg-solid">
      {!isKeyboardVisible && (
        <View
          className="absolute left-0 bottom-0 w-full h-full"
          style={{transform: [{scale: 1.1}]}}>
          <LottieView
            ref={animation}
            style={{
              flex: 1,
            }}
            source={require('@assets/lottie/voice.json')}
            autoPlay
            loop
          />
        </View>
      )}
      <View className="flex-1">
        <AppBar
          exitCallbackFn={() => navigation.goBack()}
          className="absolute top-[6] w-full"
        />
        <View className="pt-[149] flex-1 items-center">
          {/* 프로필 이미지 영역 */}
          <View className="relative w-[78] h-[78] justify-center items-center">
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
                  : require('@assets/pngs/logo/app/app_logo_yellow.png')
              }
              className="w-[70] h-[70]"
              style={{borderRadius: 35}}
            />
            <View
              className="absolute left-0 bottom-0 w-[78] h-[78] border border-yellowPrimary"
              style={{borderRadius: 39}}
            />
          </View>

          {/* 봉사자 정보 및 스크립트 */}
          <Txt
            type="body2"
            text="봉사자 닉네임"
            className="text-yellowPrimary mt-[13] mb-[25] text-center"
          />
          <View className="px-[32]">
            <Txt
              type="title3"
              text={script ?? ''}
              className="text-gray200 text-center"
            />
          </View>

          {/* 재생/정지 버튼 */}
          <Pressable onPress={handlePlayButtonClick} className="mt-[52]">
            {isPlaying ? <StopIcon /> : <PlayIcon />}
          </Pressable>

          {/* 하단 입력 영역 */}
          <View
            className="absolute bottom-0 w-full"
            style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
            {/* 감정 표현 옵션 */}
            {isClickedEmotion && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                className="pl-[25] w-full mb-[27]">
                {EMOTION_OPTIONS.map((emotion, index) => (
                  <Pressable
                    key={emotion.label}
                    className={`bg-tabIcon py-[9] pl-[14] pr-[19] ${
                      index === EMOTION_OPTIONS.length - 1
                        ? 'mr-[50]'
                        : 'mr-[10]'
                    } flex-row items-center justify-center`}
                    style={{borderRadius: 50}}>
                    {emotion.icon}
                    <Txt
                      type="body3"
                      text={emotion.label}
                      className="text-white ml-[10]"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {/* 메시지 입력 영역 */}
            <View className="h-[86] px-[25] bg-bottomNavigation flex-row items-center relative">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="감사의 말을 전해보세요"
                placeholderTextColor={'#A0A0A0'}
                className={`mr-[15] text-gray100 py-[8] px-[27] font-r bg-tabIcon border ${
                  isKeyboardVisible
                    ? 'border-gray200 w-full'
                    : 'border-tabIcon w-[307]'
                }`}
                style={{fontSize: 16, borderRadius: 100}}
                onSubmitEditing={handleMessageSend}
              />
              {!!message && (
                <Pressable
                  className={`absolute ${
                    isKeyboardVisible ? 'right-[32]' : 'right-[88]'
                  }`}
                  onPress={handleMessageSend}>
                  <SendIcon />
                </Pressable>
              )}
              {!isKeyboardVisible && (
                <Pressable
                  className=""
                  onPress={() => setIsClickedEmotion(prev => !prev)}>
                  {isClickedEmotion ? <SmileWhiteIcon /> : <SmileIcon />}
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default YouthListenScreen;
