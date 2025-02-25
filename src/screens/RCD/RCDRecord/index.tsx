// React 관련 임포트
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform, ScrollView, View} from 'react-native';

// 네비게이션 관련 임포트
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';

// API 임포트
import {postSaveVoice} from '@apis/RCDApis/postSaveVoice';
import {postVoiceAnalysis} from '@apis/RCDApis/postVoiceAnalysis';

// 컴포넌트 임포트
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import RCDTimer from '@components/atom/RCDTimer';
import RCDWave from '@components/atom/RCDWave';
import Txt from '@components/atom/Txt';
import RCDBtnBar from '@components/molecule/RCDBtnBar';

// 녹음 관련 임포트
import {trackEvent} from '@utils/tracker';
import {
  getCurrentMeteringIOS,
  playSoundIOS,
  startRecordingIOS,
  stopEverythingIOS,
  stopRecordingIOS,
} from './Record';
import {
  getCurrentMeteringAndroid,
  playRecordingAndroid,
  startRecordingAndroid,
  stopEverythingAndroid,
  stopRecordingAndroid,
} from './RecordAndroid';

// 녹음 화면 컴포넌트
const RCDRecordScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDRecord'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  // 라우트 파라미터 추출
  const {type, voiceFileId, content} = route.params;
  // 녹음 상태 관리
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uri, setUri] = useState<string | null>(null);
  const [volumeList, setVolumeList] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  // 업로드 상태 관리
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // 컴포넌트 언마운트 여부 및 재시도 타이머 관리 ref
  const isMountedRef = useRef(true);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAndroid] = useState<boolean>(Platform.OS === 'android');
  // 경과 시간 관리
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // 로딩 시간 관리
  const startTime = useRef(0);

  // 컴포넌트 마운트/언마운트 시 녹음 상태 초기화
  useEffect(() => {
    refreshRCDStates();
    return () => {
      // 컴포넌트 언마운트 시 녹음 중지
      isAndroid ? stopEverythingAndroid() : stopEverythingIOS();
      // 언마운트 되었음을 표시하고, 재시도 타이머가 있으면 해제
      isMountedRef.current = false;
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  // 화면에 포커스될 때마다 상태 초기화
  useFocusEffect(
    React.useCallback(() => {
      refreshRCDStates();
    }, []),
  );

  // 녹음 중 볼륨 모니터링
  // useEffect(() => {
  //   const monitorVolume = async () => {
  //     if (!isRecording) return;
  //     const currentMetering = await (isAndroid
  //       ? getCurrentMeteringAndroid()
  //       : getCurrentMeteringIOS());
  //     // console.log('currentMetering', currentMetering);
  //     if (currentMetering !== undefined) {
  //       setVolumeList(prev => [...prev, currentMetering]);
  //     }
  //   };

  //   monitorVolume();
  // }, [isRecording, volumeList]);

  useEffect(() => {
    const monitorVolume = async () => {
      if (!isRecording) return;
      // 100ms마다 볼륨 측정
      setTimeout(async () => {
        const currentMetering = await (isAndroid
          ? getCurrentMeteringAndroid()
          : getCurrentMeteringIOS());
        // console.log('currentMetering', currentMetering);
        if (currentMetering !== undefined) {
          setVolumeList(prev => [...prev, currentMetering]);
        }
      }, 50);
    };

    monitorVolume();
  }, [isRecording, volumeList]);

  // 녹음 관련 상태 초기화 함수
  const refreshRCDStates = async () => {
    try {
      if (isAndroid) {
        await stopEverythingAndroid();
      } else {
        await stopEverythingIOS();
      }
      setIsDone(false);
      setIsPlaying(false);
      setVolumeList([]);
      setIsRecording(false);
      setUri(null);
      setShouldRefresh(true);
    } catch (e) {
      console.log('refresh error', e);
    }
  };

  //  // 마이크 권한 체크 함수
  //  const checkPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const permission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //       );

  //       if (permission === PermissionsAndroid.RESULTS.GRANTED) {
  //         return true;
  //       } else {
  //         const hasNeverAskAgain = permission === 'never_ask_again';

  //         if (hasNeverAskAgain) {
  //           Alert.alert(
  //             '권한 필요',
  //             '녹음을 위해 마이크 권한이 필요합니다. 설정에서 권한을 활성화해주세요.',
  //             [
  //               {text: '취소', style: 'cancel'},
  //               {
  //                 text: '설정으로 이동',
  //                 onPress: () => Linking.openSettings(),
  //               },
  //             ],
  //           );
  //         }
  //         return false;
  //       }
  //     } catch (err) {
  //       console.log('checkPermission error', err);
  //       return false;
  //     }
  //   }
  //   return true;
  // };
  const startRecording = async () => {
    // console.log('startRecording');
    if (isRecording) {
      // 이미 녹음 중인 경우 중지
      await stopRecording();
    }
    // 권한 체크
    // if(!(await checkPermission())) {
    //   return;
    // }

    let tmpPath: string | null = null;
    if (isAndroid) {
      tmpPath = await startRecordingAndroid();
    } else {
      tmpPath = await startRecordingIOS();
    }

    if (tmpPath) {
      setUri(tmpPath);
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) {
      console.log('녹음이 진행되지 않았습니다.');
      return;
    }
    let tmpPath: string | null = null;

    if (isAndroid) {
      tmpPath = await stopRecordingAndroid();
    } else {
      await stopRecordingIOS();
    }
    if (tmpPath) {
      setUri(tmpPath);
    }
    setIsRecording(false);
    setIsDone(true);
  };
  const playRecording = async () => {
    if (!uri || isPlaying) return;
    setIsPlaying(true);
    if (isAndroid) {
      await playRecordingAndroid();
    } else {
      await playSoundIOS(uri);
    }
    await new Promise(resolve => setTimeout(resolve, volumeList.length * 100));
    setIsPlaying(false);
  };
  // 녹음 파일 업로드 함수
  const uploadRecording = async () => {
    if (!uri) return;
    setIsUploading(true);
    // 로딩 시간 계산
    startTime.current = new Date().getTime();

    try {
      if (isAndroid) {
        await stopEverythingAndroid();
      } else {
        await stopEverythingIOS();
      }
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

  // 음성 분석 업로드 함수
  const uploadAnalysis = async () => {
    try {
      const res = await postVoiceAnalysis(voiceFileId);
      const {code} = res;

      if (code !== 'ANALYSIS001') {
        const endTime = new Date().getTime();
        const viewTime = endTime - startTime.current;

        trackEvent('recording_loading_time', {
          type,
          content,
          view_time: viewTime,
          isError: false,
          code,
        });
      }

      switch (code) {
        case 'ANALYSIS001':
          // console.log('재시도 - ANALYSIS001 ', new Date());
          analysisTimeoutRef.current = setTimeout(uploadAnalysis, 5000);
          break;
        case 'ANALYSIS003':
          setIsUploading(false);

          navigation.navigate('RCDError', {type: type, errorType: 'notsame'});
          break;
        case 'COMMON200':
          setIsUploading(false);
          navigation.navigate('RCDFeedBack');
          trackEvent('recording_approved');
          break;
        default:
          setIsUploading(false);
          navigation.navigate('RCDError', {type: type, errorType: 'noisy'});
          break;
      }
    } catch (error: any) {
      console.error('분석 에러:', error);
      if (!isMountedRef.current) {
        console.log('에러 처리 중 컴포넌트가 언마운트되어 처리를 중단합니다.');
        return;
      }
      const errorCode = error.response?.data.code;

      const endTime = new Date().getTime();
      const viewTime = endTime - startTime.current;

      trackEvent('recording_loading_time', {
        type,
        content,
        view_time: viewTime,
        isError: true,
        code: errorCode,
      });

      switch (errorCode) {
        case 'ANALYSIS004':
        case 'ANALYSIS005':
        case 'ANALYSIS108':
          setIsUploading(false);

          navigation.navigate('RCDError', {type: type, errorType: 'server'});
          break;
        default:
          navigation.navigate('RCDError', {type: type, errorType: 'server'});
          break;
      }
    }
  };

  return (
    <BG type="solid">
      {!isUploading ? (
        <>
          <AppBar
            title={
              type === 'DAILY'
                ? '일상 알림 녹음'
                : type === 'COMFORT'
                ? '위로 알림 녹음'
                : '정보 알림 녹음'
            }
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
                  text={
                    type === 'INFO'
                      ? '준비된 문장을 시간 내에 또박또박 발음해주세요'
                      : '준비한 문장을 시간 내에 또박또박 발음해주세요'
                  }
                  className="text-gray200"
                />
                <View className="mt-[28]">
                  <Txt
                    type={type === 'DAILY' ? 'title2' : 'body3'}
                    text={content}
                    className="text-white"
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <RCDWave
                volumeList={volumeList}
                isPlaying={isPlaying}
                recording={isRecording}
                isDone={isDone}
                elapsedTime={elapsedTime}
              />
              <View className="mt-[28]" />
              <RCDTimer
                recording={isRecording}
                stop={stopRecording}
                type={type}
                onTimeUpdate={elapsedTime => setElapsedTime(elapsedTime)}
                shouldRefresh={shouldRefresh}
                setShouldRefresh={setShouldRefresh}
              />
              <View className="w-full px-px mt-[40] mb-[70]">
                <RCDBtnBar
                  record={() => {
                    startRecording();
                    trackEvent('recording_start');
                  }}
                  play={playRecording}
                  upload={uploadRecording}
                  isPlaying={isPlaying}
                  recording={isRecording}
                  isDone={isDone}
                  refresh={refreshRCDStates}
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
            <View className="mt-[23]" />
            <Txt
              type="body3"
              text={`세심한 확인이 필요할 때는\n시간이 조금 더 소요될 수 있어요`}
              className="text-gray200 text-center"
            />
            <View className="mt-[54]" />
            <ActivityIndicator size="large" color="#f9f96c" />
          </View>
        </>
      )}
    </BG>
  );
};

export default RCDRecordScreen;
