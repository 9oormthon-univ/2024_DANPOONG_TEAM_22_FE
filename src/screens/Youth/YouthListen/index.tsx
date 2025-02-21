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

// 아이콘 import
import {postComment} from '@apis/providedFile';
import PlayIcon from '@assets/svgs/play_youth.svg';
import SendIcon from '@assets/svgs/send.svg';
import SmileIcon from '@assets/svgs/smile.svg';
import SmileGrayIcon from '@assets/svgs/smile_gray.svg';
import StopIcon from '@assets/svgs/stop.svg';
import BG from '@components/atom/BG';
import Toast from '@components/atom/Toast';
import {COLORS} from '@constants/Colors';
import {EMOTION_OPTIONS_YOUTH} from '@constants/letter';
import {EmotionType} from '@type/api/providedFile';

// 네비게이션 Props 타입 정의
type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthListenScreen'
>;

const YouthListenScreen = ({route, navigation}: Readonly<YouthProps>) => {
  const {alarmId} = route.params;
  // 상태 관리
  const [message, setMessage] = useState(''); // 메시지 입력값
  const [isClickedEmotion, setIsClickedEmotion] = useState(false); // 감정 표현 클릭 여부
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // 키보드 표시 여부
  const animation = useRef<LottieView>(null); // 애니메이션 ref
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 재생 여부
  const [voiceFile, setVoiceFile] = useState<VoiceFileResponseData>(
    {} as VoiceFileResponseData,
  ); // 음성 파일 데이터
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const audioPlayer = useRef(new AudioRecorderPlayer()); // 오디오 플레이어 ref
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지

  // 초기 로딩 처리
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // 음성 파일 로드 및 재생
  useEffect(() => {
    if (!alarmId) return;

    (async () => {
      try {
        const res = await getVoiceFiles({alarmId});
        console.log(res);
        setVoiceFile(res.result);
        setTimeout(async () => {
          await audioPlayer.current.startPlayer(res.result.fileUrl);
          setIsPlaying(true);
        }, 2000);
      } catch (error) {
        console.log(error);
        // Alert.alert('오류', '음성 파일을 불러오는 중 오류가 발생했어요');
        const mockVoiceFile: VoiceFileResponseData = {
          fileUrl:
            'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/mom.mp4',
          voiceFileId: 1,
          providedFileId: 1,
          // content:
          //   '아침 거르고 빈속으로 있으면 힘들어요\n가볍게라도 꼭 챙겨 드시길 바라요',
          content:
            '안녕하세요, 요즘 많이 힘드셨죠? 하루하루\n버텨내느라 정말 수고 많았어요. 혹시 오늘,\n잠깐이라도 햇빛을 쬐러 창밖으로 걸어 나와 볼래요? 햇빛을 조금 쬐면 기분이 훨씬 나아질 거예요.\n주변에 괜찮은 카페가 있다면 따뜻한 음료도 한 잔\n마셔보세요. 작은 변화가 큰 힘이 되니까요. 제가\n항상 당신을 응원하고 있어요.',
          member: {
            id: 0,
            name: '네잎클로바',
            profileImage: '',
          },
        };
        setVoiceFile(mockVoiceFile);
        setTimeout(async () => {
          await audioPlayer.current.startPlayer(mockVoiceFile.fileUrl);
          setIsPlaying(true);
        }, 1000);
      }
    })();

    return () => {
      (async () => {
        await audioPlayer.current.stopPlayer();
        audioPlayer.current.removePlayBackListener();
        setIsPlaying(false);
      })();
    };
  }, [alarmId]);

  const handleMessageSend = async (emotionType?: EmotionType) => {
    if (!emotionType && !message) return;

    if (emotionType) {
      const emotion = EMOTION_OPTIONS_YOUTH.find(
        option => option.type === emotionType,
      );
      if (!emotion) return;
      setIsToast(true);
      setToastMessage(`‘${emotion.label}’ 전송 완료`);
    } else {
      setIsToast(true);
      setToastMessage('메시지 전송 완료');
    }

    try {
      await postComment({
        providedFileId: voiceFile.providedFileId,
        message: emotionType ?? message,
      });
      setMessage('');
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '편지를 보내는 중 오류가 발생했어요');
    }
  };

  // 재생/정지 버튼 클릭 처리
  const handlePlayButtonClick = async () => {
    console.log({isPlaying, fileUrl: voiceFile.fileUrl});
    try {
      if (isPlaying) {
        await audioPlayer.current.pausePlayer();
        setIsPlaying(false);
      } else {
        const playResult = await audioPlayer.current.startPlayer(
          voiceFile.fileUrl,
        );
        console.log('재생 시작:', playResult);
        setIsPlaying(true);

        // 재생 상태 감지
        audioPlayer.current.addPlayBackListener(e => {
          console.log('재생 위치:', e.currentPosition, '총 길이:', e.duration);
          if (e.currentPosition >= e.duration) {
            console.log('재생 끝');
            setIsPlaying(false); // 재생 끝나면 아이콘 변경
          }
        });
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
    <BG type="main">
      {!isKeyboardVisible && (
        <View
          className="absolute left-0 bottom-[40] w-full h-full"
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
          className="absolute top-[0] w-full"
        />

        <View className="h-[100] " />

        <View className="flex-1 items-center">
          {/* 프로필 */}
          <View className="flex-row self-start px-[30]">
            <View className="relative w-[31] h-[31] justify-center items-center">
              {/* TODO: 봉사자 프로필 사진 표시 */}
              <Image
                source={
                  voiceFile.member.profileImage
                    ? {uri: voiceFile.member.profileImage}
                    : require('@assets/pngs/logo/app/app_logo_yellow.png')
                }
                className="w-[25] h-[25]"
                style={{borderRadius: 25}}
              />
              <View
                className="absolute left-0 bottom-0 w-[31] h-[31] border border-yellowPrimary"
                style={{borderRadius: 31}}
              />
            </View>
            <View className="w-[10]" />
            {/* TODO: 봉사자 닉네임 표시 */}
            <Txt
              type="title4"
              text={voiceFile.member.name}
              className="text-yellowPrimary"
            />
          </View>

          <View className="h-[33] " />

          {/* 스크립트 */}
          <View className="px-[30] h-[244]">
            <ScrollView>
              <Txt
                type="body3"
                text={voiceFile.content ?? ''}
                className="text-white"
              />
            </ScrollView>
          </View>

          <View className="h-[33] " />

          {/* 재생/정지 버튼 */}
          <Pressable onPress={handlePlayButtonClick} className="w-[69] h-[69]">
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
                {EMOTION_OPTIONS_YOUTH.map((emotion, index) => (
                  <Pressable
                    key={emotion.label}
                    className={`bg-blue400 py-[9] pl-[14] pr-[19] ${
                      index === EMOTION_OPTIONS_YOUTH.length - 1
                        ? 'mr-[50]'
                        : 'mr-[10]'
                    } flex-row items-center justify-center active:bg-blue500`}
                    style={{borderRadius: 50}}
                    onPress={() => handleMessageSend(emotion.type)}>
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
            <View className="h-[86] px-[25] bg-blue500 flex-row items-center relative">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="감사의 말을 전해보세요"
                placeholderTextColor={COLORS.gray300}
                className={`h-[40] mr-[15] text-gray100 py-[8] pl-[27] pr-[45] font-r bg-blue400 border ${
                  isKeyboardVisible
                    ? 'border-gray200 w-full'
                    : 'border-blue400 w-[307]'
                }`}
                style={{fontSize: 15, borderRadius: 100}}
                onSubmitEditing={() => handleMessageSend()}
                maxLength={160}
              />
              {!!message && (
                <Pressable
                  className={`absolute ${
                    isKeyboardVisible ? 'right-[32]' : 'right-[88]'
                  }`}
                  onPress={() => handleMessageSend()}>
                  <SendIcon />
                </Pressable>
              )}
              {!isKeyboardVisible && (
                <Pressable
                  className=""
                  onPress={() => setIsClickedEmotion(prev => !prev)}>
                  {isClickedEmotion ? <SmileGrayIcon /> : <SmileIcon />}
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      <Toast
        text={toastMessage}
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
        position="left"
        type="check"
      />
    </BG>
  );
};

export default YouthListenScreen;
