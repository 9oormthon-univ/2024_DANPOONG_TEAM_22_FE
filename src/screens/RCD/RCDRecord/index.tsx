import {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import RCDWave from '@components/atom/RCDWave';
import BG from '@components/atom/BG';
import RCDBtnBar from '@components/molecule/RCDBtnBar';
import RCDTimer from '@components/atom/RCDTimer';
import Txt from '@components/atom/Txt';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
// import {postVoiceAnalysis} from '@apis/RCDApis/postVoiceAnalysis';
import {postSaveVoice} from '@apis/RCDApis/postSaveVoice';
import AppBar from '@components/atom/AppBar';
import RNFS from 'react-native-fs';
import { postVoiceAnalysis } from '@apis/RCDApis/postVoiceAnalysis';
import { ActivityIndicator } from 'react-native';
const audioRecorderPlayer = new AudioRecorderPlayer();

const RCDRecordScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDRecord'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  // const {item,gptRes,alarmId,voiceFileId,content,type} = route.params;
  const {type, ...rest} = route.params;
  const {
    item = null,
    gptRes = null,
    alarmId = 0,
    voiceFileId = 0,
    content = '',
  } = 'item' in route.params ? route.params : {};
  const [isError, setIsError] = useState<boolean>(false);
  const [errType, setErrType] = useState<'bad' | 'noisy' | 'server'>('bad');

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uri, setUri] = useState<string | null>(null);
  const [volumeList, setVolumeList] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  useEffect(() => {
    refleshRCDStates();
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
    };
  }, []);

  const refleshRCDStates = () => {
    try {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
      setIsDone(false);
      setIsPaused(false);
      setIsPlaying(false);
      setVolumeList([]);
      setIsRecording(false);
      setUri(null);
      console.log('refleshRCDStates!@');
    } catch (e) {
      console.log('reflesh error', e);
    }
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );

        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          const hasNeverAskAgain = permission === 'never_ask_again';

          if (hasNeverAskAgain) {
            Alert.alert(
              '권한 필요',
              '녹음을 위해 마이크 권한이 필요합니다. 설정에서 권한을 활성화해주세요.',
              [
                {text: '취소', style: 'cancel'},
                {
                  text: '설정으로 이동',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
          return false;
        }
      } catch (err) {
        console.log('checkPermission error', err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    // console.log('startRecording');
    // 권한 확인
    if (!(await checkPermission())) {
      return;
    }
    // console.log('checkPermission success');

    try {
      // 플랫폼에 따라 파일 경로 설정
      const path = Platform.select({
        ios: 'recording.m4a',
        android: `${RNFS.DocumentDirectoryPath}/recording.wav`,
      });
      // console.log('path', path);
      try {
        const audioSet: AudioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        // 녹음 시작
        const result = await audioRecorderPlayer.startRecorder(
          path,
          audioSet,
          true,
        );
        audioRecorderPlayer.setSubscriptionDuration(0.1);
        // console.log('result', result);
        // 녹음 파일의 URI 저장
        setUri(result);
        // 녹음 상태 업데이트
        setIsRecording(true);
      } catch (e) {
        console.log('e', e);
      }
    } catch (err) {
      console.log('Failed to start recording', err);
    }
  };
  useEffect(() => {
    if (isRecording) {
      audioRecorderPlayer.addRecordBackListener(e => {
        const currentMetering = e.currentMetering;
        // console.log('currentMetering', currentMetering)
        if (currentMetering !== undefined) {
          setVolumeList(prev => [...prev, currentMetering]);
        }
        return;
      });
      return () => {
        audioRecorderPlayer.removeRecordBackListener();
      };
    }
  }, [isRecording]);

  const stopRecording = async () => {
    if (!isRecording) {
      console.log('Recording is not in progress, no need to stop');
      return;
    }
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsDone(true);
      // console.log('stopRecording');
    } catch (err) {
      console.log('Failed to stop recording', err);
    }
  };

  const playSound = async () => {
    // 녹음된 파일의 URI가 존재하고, 현재 재생 중이 아닐 때만 실행
    if (uri && !isPlaying) {
      try {
        setIsPlaying(true); // 재생 상태로 설정
        await audioRecorderPlayer.startPlayer(uri); // 녹음 파일 재생 시작
        audioRecorderPlayer.addPlayBackListener(() => {}); // 재생 중 이벤트 리스너 추가
        await new Promise(resolve =>
          setTimeout(resolve, volumeList.length * 100),
        ); // 볼륨 리스트 길이에 따라 재생 시간 조정
        await audioRecorderPlayer.stopPlayer(); // 재생 중지
        audioRecorderPlayer.removePlayBackListener(); // 재생 이벤트 리스너 제거
        setIsPlaying(false); // 재생 상태 해제
      } catch (err) {
        console.log('Failed to play sound', err); // 오류 로그 출력
        setIsPlaying(false); // 오류 발생 시 재생 상태 해제
      }
    }
  };

  const uploadRecording = async () => {
    if (!uri) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'android' ? `file://${uri}` : uri,
        name: 'recording.wav', 
        type: 'audio/wav',
      } as any);

      await postSaveVoice(voiceFileId, formData);
      await uploadAnalysis();
    } catch (error: any) {
      console.log('음성 파일 업로드 오류:', error);
    }
  };

  const uploadAnalysis = async () => {
    try {
      await postVoiceAnalysis(voiceFileId);
    } catch (error: any) {
      console.log('음성 파일 분석 오류:', error);

      const errorCode = error.response?.data.code;
      
      switch(errorCode) {
        case 'ANALYSIS001':
          // 분석 중인 경우 1초 후 재시도
          setTimeout(uploadAnalysis, 1000);
          break;
        case 'ANALYSIS002':
          // 분석 실패 - 노이즈
          navigation.navigate('RCDError', {type: 'noisy'});
          break;
        default:
          // 서버 오류
          navigation.navigate('RCDError', {type: 'server'});
          break;
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BG type="solid">
      {!isUploading ? (
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
          <View className="flex-1 justify-center items-center">
       
            <Txt type="title1" text="듣고 있어요..." className="text-white" />
            <View className="mt-[23]"/>
            <Txt type="body3" text={`세심한 확인이 필요할 때는\n시간이 조금 더 소요될 수 있어요`} className="text-gray200 text-center" />
            <View className="mt-[54]"/>
            <ActivityIndicator size="large" color="#f9f96c" />
          </View>
        </>
      )}
    </BG>
  );
};

export default RCDRecordScreen;
