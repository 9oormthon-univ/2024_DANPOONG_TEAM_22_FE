import {useEffect, useState} from 'react';
import {ScrollView, View, Platform, PermissionsAndroid} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RCDWave from '@components/atom/RCDWave';
import BG from '@components/atom/BG';
import RCDBtnBar from '@components/molecule/RCDBtnBar';
import RCDTimer from '@components/atom/RCDTimer';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/button/Button';
import Notice1 from '../../../assets/svgs/Notice1.svg';
import Notice2 from '../../../assets/svgs/Notice2.svg';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '../../types/HomeStackParamList';
import {postVoiceAnalysis} from '@apis/RCDApis/postVoiceAnalysis';
import AppBar from '@components/atom/AppBar';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RCDRecordScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDRecord'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {item, gptRes, alarmId, voiceFileId, content, type} = route.params;
  const [isError, setIsError] = useState<boolean>(false);
  const [errType, setErrType] = useState<'bad' | 'noisy' | 'server'>('bad');

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uri, setUri] = useState<string | null>(null);
  const [volumeList, setVolumeList] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    refleshRCDStates();
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
    };
  }, []);

  const refleshRCDStates = () => {
    setIsDone(false);
    setIsPaused(false);
    setIsPlaying(false);
    setVolumeList([]);
    setIsRecording(false);
    setUri(null);
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const granted = Object.values(grants).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );

        return granted;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const startRecording = async () => {
    if (!(await checkPermission())) {
      return;
    }

    try {
      const path = Platform.select({
        ios: 'recording.m4a',
        android: 'sdcard/recording.wav',
      });

      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener(e => {
        setVolumeList(prev => [...prev, e.currentMetering || 0]);
      });
      setUri(result);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsDone(true);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playSound = async () => {
    if (uri && !isPlaying) {
      try {
        setIsPlaying(true);
        await audioRecorderPlayer.startPlayer(uri);
        audioRecorderPlayer.addPlayBackListener(() => {});
        await new Promise(resolve =>
          setTimeout(resolve, volumeList.length * 100),
        );
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setIsPlaying(false);
      } catch (err) {
        console.error('Failed to play sound', err);
        setIsPlaying(false);
      }
    }
  };

  const uploadRecording = async () => {
    if (uri) {
      try {
        const file = new FormData();
        file.append('file', {
          uri: Platform.OS === 'android' ? `file://${uri}` : uri,
          name: 'recording.wav',
          type: 'audio/wav',
        } as any);

        const response = await postVoiceAnalysis(file, voiceFileId);
        console.log('음성 파일 분석 결과:', response);
        navigation.navigate('RCDFeedBack');
      } catch (error: any) {
        if (error.response?.data.code === 'ANALYSIS0001') {
          setIsError(true);
          setErrType('bad');
        } else if (error.response?.data.code === 'ANALYSIS0002') {
          setIsError(true);
          setErrType('noisy');
        } else {
          setIsError(true);
          setErrType('server');
        }
        console.error('음성 파일 업로드 오류:', error);
      }
    }
  };

  return (
    <BG type="solid">
      {!isError ? (
        <>
          <AppBar
            title=""
            goBackCallbackFn={() => {
              navigation.goBack();
            }}
            className="absolute top-[0] w-full"
          />
          <View className="flex-1 justify-between mt-[65]">
            <View className="px-px pt-[0] h-[250]">
              <ScrollView className="h-full">
                <View className="mt-[53]" />
                <Txt
                  type="body4"
                  text="준비한 문장을 시간 내에 또박또박 발음해주세요"
                  className="text-gray200"
                />
                <View className="mt-[28]">
                  <Txt type="title2" text={content} className="text-white" />
                </View>
              </ScrollView>
            </View>

            <View>
              <RCDWave
                volumeList={volumeList}
                isPlaying={isPlaying}
                recording={isRecording}
                isDone={isDone}
              />
              <View className="mt-[28]" />
              <RCDTimer
                recording={isRecording}
                isPaused={isPaused}
                isDone={isDone}
                setIsDone={setIsDone}
                stop={stopRecording}
                type={type}
              />
              <View className="w-full px-px mt-[40] mb-[70]">
                <RCDBtnBar
                  record={startRecording}
                  play={playSound}
                  upload={uploadRecording}
                  isPlaying={isPlaying}
                  recording={isRecording}
                  isDone={isDone}
                  reflesh={refleshRCDStates}
                  stop={stopRecording}
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <AppBar
            title=""
            exitCallbackFn={() => {
              navigation.goBack();
            }}
            className="absolute top-[0] w-full"
          />
          <View className="flex-1 items-center justify-between mt-[65]">
            <View className="absolute top-[194] items-center">
              {errType === 'bad' ? <Notice1 /> : <Notice2 />}
              <View className="mt-[43]" />
              <Txt
                type="title2"
                text={
                  errType === 'bad'
                    ? '부적절한 표현이 감지되어\n녹음을 전송할 수 없어요'
                    : errType === 'noisy'
                    ? '주변 소음이 크게 들려서\n녹음을 전송할 수 없었어요'
                    : '서버에 문제가 생겨\n녹음을 전송할 수 없었어요'
                }
                className="text-white text-center"
              />
              <View className="mt-[25]" />
              <Txt
                type="body4"
                text={
                  errType === 'bad'
                    ? '적절한 언어로 다시 녹음해 주시겠어요?'
                    : errType === 'noisy'
                    ? '조용한 장소에서 다시 녹음해 주시겠어요?'
                    : '다시 시도해 주시겠어요?'
                }
                className="text-gray300 text-center"
              />
            </View>
            <View className="px-px w-full absolute bottom-[50]">
              <Button
                text="다시 녹음하기"
                onPress={() => {
                  if (errType === 'bad') {
                    navigation.navigate('Home');
                  } else {
                    navigation.goBack();
                  }
                }}
                disabled={false}
              />
            </View>
          </View>
        </>
      )}
    </BG>
  );
};

export default RCDRecordScreen;
