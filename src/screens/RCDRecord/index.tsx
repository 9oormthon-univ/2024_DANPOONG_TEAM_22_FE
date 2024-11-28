import { useEffect, useState } from 'react'
import { ScrollView, View, Platform, PermissionsAndroid, Linking, Alert } from 'react-native'
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, AVEncoderAudioQualityIOSType, AVEncodingOption, AVModeIOSOption } from 'react-native-audio-recorder-player'
import RCDWave from '@components/atom/RCDWave'
import BG from '@components/atom/BG'
import RCDBtnBar from '@components/molecule/RCDBtnBar'
import RCDTimer from '@components/atom/RCDTimer'
import Txt from '@components/atom/Txt'
import Button from '@components/atom/Button'
import Notice1 from '../../../assets/svgs/Notice1.svg'
import Notice2 from '../../../assets/svgs/Notice2.svg'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../types/HomeStackParamList'
import { postVoiceAnalysis } from '@apis/RCDApis/postVoiceAnalysis'
import AppBar from '@components/atom/AppBar'
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer()

const RCDRecordScreen = ({route}: {route: RouteProp<HomeStackParamList, 'RCDRecord'>}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()
  // const {item,gptRes,alarmId,voiceFileId,content,type} = route.params;
  const {type, ...rest} = route.params;
  const {item = null, gptRes = null, alarmId = 0, voiceFileId = 0, content = ''} = 'item' in route.params ? route.params : {};
  const [isError,setIsError] = useState<boolean>(false)
  const [errType,setErrType] = useState<'bad'|'noisy'|'server'>('bad')
  
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [uri, setUri] = useState<string | null>(null)
  const [volumeList, setVolumeList] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)

  useEffect(() => {
    refleshRCDStates();
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
    };
  }, []);



  const refleshRCDStates = () => {
    try{
      audioRecorderPlayer.stopRecorder()
      audioRecorderPlayer.stopPlayer()
      setIsDone(false)
      setIsPaused(false) 
      setIsPlaying(false)
      setVolumeList([])
      setIsRecording(false)
      setUri(null)
      console.log('reflesh!@')
    }catch(e){console.log('reflesh error',e)}
  }
 
  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
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
                { text: '취소', style: 'cancel' },
                { 
                  text: '설정으로 이동', 
                  onPress: () => Linking.openSettings() 
                }
              ]
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
  }


  const startRecording = async () => {
    console.log('startRecording')
    // 권한 확인
    if (!await checkPermission()) {
      return
    }
    console.log('checkPermission success')

    try {
      // 플랫폼에 따라 파일 경로 설정
      const path = Platform.select({
        ios: 'recording.m4a',
        android: `${RNFS.DocumentDirectoryPath}/recording.wav`,
      })
      console.log('path', path)
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
        const result = await audioRecorderPlayer.startRecorder(path, audioSet, true)
        audioRecorderPlayer.setSubscriptionDuration(0.1);
        console.log('result', result)
        // 녹음 파일의 URI 저장
        setUri(result)
        // 녹음 상태 업데이트
        setIsRecording(true)
      } catch (e) {
        console.log('e', e)
      }
    } catch (err) {
      console.log('Failed to start recording', err)
    }
  }
  useEffect(() => {
    if (isRecording) {
    
      audioRecorderPlayer.addRecordBackListener((e) => {
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
      console.log('Recording is not in progress, no need to stop')
      return
    }
    try {
      await audioRecorderPlayer.stopRecorder()
      audioRecorderPlayer.removeRecordBackListener()
      setIsRecording(false)
      setIsDone(true)
      console.log('stopRecording')
    } catch (err) {
      console.log('Failed to stop recording', err)
    }
  };


  const playSound = async () => {
    // 녹음된 파일의 URI가 존재하고, 현재 재생 중이 아닐 때만 실행
    if (uri && !isPlaying) {
      try {
        setIsPlaying(true) // 재생 상태로 설정
        await audioRecorderPlayer.startPlayer(uri) // 녹음 파일 재생 시작
        audioRecorderPlayer.addPlayBackListener(() => {}) // 재생 중 이벤트 리스너 추가
        await new Promise(resolve => setTimeout(resolve, volumeList.length * 100)) // 볼륨 리스트 길이에 따라 재생 시간 조정
        await audioRecorderPlayer.stopPlayer() // 재생 중지
        audioRecorderPlayer.removePlayBackListener() // 재생 이벤트 리스너 제거
        setIsPlaying(false) // 재생 상태 해제
      } catch (err) {
        console.log('Failed to play sound', err) // 오류 로그 출력
        setIsPlaying(false) // 오류 발생 시 재생 상태 해제
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
