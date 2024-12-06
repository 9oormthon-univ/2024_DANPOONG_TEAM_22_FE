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
import PlayIcon from '@assets/svgs/play_youth.svg';
import SendIcon from '@assets/svgs/send.svg';
import SmileIcon from '@assets/svgs/smile.svg';
import SmileWhiteIcon from '@assets/svgs/smile_white.svg';
import StopIcon from '@assets/svgs/stop.svg';
import {postComment} from '@apis/providedFile';
import {EmotionType} from '@type/api/providedFile';
import {EMOTION_OPTIONS} from '@constants/letter';

type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthListenScreen'
>;

const YouthListenScreen = ({route, navigation}: Readonly<YouthProps>) => {
  const {alarmId, script} = route.params;
  const [message, setMessage] = useState('');
  const [isClickedEmotion, setIsClickedEmotion] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const imageUri = null;
  const animation = useRef<LottieView>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceFile, setVoiceFile] = useState<VoiceFileResponseData>(
    {} as VoiceFileResponseData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const audioPlayer = useRef(new AudioRecorderPlayer());

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      animation.current?.play();
    } else {
      animation.current?.pause();
    }
  }, [isPlaying]);

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

  useEffect(() => {
    (async () => {
      if (!alarmId) {
        return;
      }
      try {
        const res = await getVoiceFiles({alarmId});
        console.log(res);
        setVoiceFile(res.result);
        setTimeout(async () => {
          await audioPlayer.current.startPlayer(res.result.fileUrl);
          setIsPlaying(true);
        }, 1000);
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

    return async () => {
      if (isPlaying) {
        await audioPlayer.current.stopPlayer();
        setIsPlaying(false);
      }
    };
  }, [alarmId, isPlaying]);

  const handleMessageSend = async ({
    emotionType,
  }: {
    emotionType?: EmotionType;
  }) => {
    if (!emotionType && !message) {
      return;
    }
    try {
      await postComment({
        providedFileId: voiceFile.providedFileId,
        message: emotionType ?? message,
      });
      Alert.alert('성공', '편지를 성공적으로 보냈어요');
      setMessage('');
    } catch (error) {
      console.log(error);
      // Alert.alert('오류', '편지를 보내는 중 오류가 발생했어요');
    }
  };

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

  if (isLoading) {
    return <LoadingScreen />;
  }
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

          <Pressable onPress={handlePlayButtonClick} className="mt-[52]">
            {isPlaying ? <StopIcon /> : <PlayIcon />}
          </Pressable>

          <View
            className="absolute bottom-0 w-full"
            style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
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
                    style={{borderRadius: 50}}
                    onPress={() =>
                      handleMessageSend({emotionType: emotion.type})
                    }>
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
