// React 관련 임포트
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { postVoicefilesAnalysisByVoiceFileId } from '@apis/VolunteerRecord/post/VoicefilesAnalysisByVoiceFileId/fetch';
// API 임포트
import { postVoicefilesByVoiceFileId } from '@apis/VolunteerRecord/post/VoicefilesByVoiceFileId/fetch';
// 컴포넌트 임포트
import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import { FlexableMargin } from '@components/FlexableMargin';
import { Spinner } from '@components/Spinner';
// 네비게이션 관련 임포트
import {
  type NavigationProp,
  type RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { RCDBtnBar } from '@screens/RCD/RCDRecord/components/RCDBtnBar';
import { RCDTimer } from '@screens/RCD/RCDRecord/components/RCDTimer';
import { RCDWave } from '@screens/RCD/RCDRecord/components/RCDWave';
import { type HomeStackParamList } from '@type/nav/HomeStackParamList';
// 녹음 관련 임포트
import { trackEvent } from '@utils/tracker';

import {
  getCurrentMeteringAndroid,
  playRecordingAndroid,
  startRecordingAndroid,
  stopEverythingAndroid,
  stopRecordingAndroid,
} from './RecordAndroid';
import {
  getCurrentMeteringIOS,
  playRecordingIOS,
  startRecordingIOS,
  stopEverythingIOS,
  stopRecordingIOS,
} from './RecordIos';

const isIOS = Platform.OS === 'ios';

// 녹음 화면 컴포넌트
export const RCDRecordScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDRecord'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  // 라우트 파라미터 추출
  const { type, voiceFileId, content } = route.params;
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

  // 경과 시간 관리
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // 로딩 시간 관리
  const startTime = useRef(0);

  // 컴포넌트 마운트/언마운트 시 녹음 상태 초기화
  useEffect(() => {
    refreshRCDStates();

    return () => {
      // 컴포넌트 언마운트 시 녹음 중지
      if (isIOS) {
        stopEverythingIOS();
      } else {
        stopEverythingAndroid();
      }

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

  useEffect(() => {
    const monitorVolume = async () => {
      if (!isRecording) return;

      // 50ms마다 볼륨 측정
      setTimeout(async () => {
        const currentMetering = await (isIOS
          ? getCurrentMeteringIOS()
          : getCurrentMeteringAndroid());

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
      if (isIOS) {
        await stopEverythingIOS();
      } else {
        await stopEverythingAndroid();
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

  const startRecording = async () => {
    // 이미 녹음 중인 경우 중지
    if (isRecording) await stopRecording();

    let tmpPath: string | null = null;

    if (isIOS) {
      tmpPath = await startRecordingIOS();
    } else {
      tmpPath = await startRecordingAndroid();
    }

    if (tmpPath) {
      setUri(tmpPath);
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (!isRecording && __DEV__) {
      console.log('녹음이 진행되지 않았습니다.');

      return;
    }

    let tmpPath: string | null = null;

    if (isIOS) {
      await stopRecordingIOS();
    } else {
      tmpPath = await stopRecordingAndroid();
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

    if (isIOS) {
      await playRecordingIOS();
    } else {
      await playRecordingAndroid();
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
      if (isIOS) {
        await stopEverythingIOS();
      } else {
        await stopEverythingAndroid();
      }

      const formData = new FormData();

      formData.append('file', {
        uri: `file://${uri}`,
        name: 'recording.wav',
        type: 'audio/wav',
      } as { uri: string; name: string; type: string });

      await postVoicefilesByVoiceFileId(voiceFileId, formData);
      await uploadAnalysis();
    } catch (error) {
      console.log('음성 파일 업로드 오류:', error);
    }
  };
  // 음성 분석 업로드 함수
  const uploadAnalysis = async () => {
    try {
      const res = await postVoicefilesAnalysisByVoiceFileId(voiceFileId);
      const { code } = res;

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

          navigation.navigate('RCDError', { type: type, errorType: 'notsame' });
          break;
        case 'COMMON200':
          setIsUploading(false);
          navigation.navigate('RCDFeedBack');
          trackEvent('recording_approved');
          break;

        default:
          setIsUploading(false);
          navigation.navigate('RCDError', { type: type, errorType: 'noisy' });
          break;
      }
    } catch (error) {
      console.error('분석 에러:', error);

      if (!isMountedRef.current) {
        console.log('에러 처리 중 컴포넌트가 언마운트되어 처리를 중단합니다.');

        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorCode = (error as any).response?.data.code;

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

          navigation.navigate('RCDError', { type: type, errorType: 'server' });
          break;

        default:
          navigation.navigate('RCDError', { type: type, errorType: 'server' });
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
          />
          <FlexableMargin flexGrow={123} />
          <CustomText
            type="body4"
            text={
              type === 'INFO'
                ? '준비된 문장을 시간 내에 또박또박 발음해주세요'
                : '준비한 문장을 시간 내에 또박또박 발음해주세요'
            }
            className="text-gray200 px-px"
          />
          <FlexableMargin flexGrow={29} />

          {/* 상단 텍스트 영역 - 자막 */}
          <ScrollView className="px-px h-[189]">
            <CustomText
              type={type === 'DAILY' ? 'title2' : 'body3'}
              text={content}
              className="text-white"
            />
          </ScrollView>
          <FlexableMargin flexGrow={41} />

          {/* 하단 녹음 wave , 버튼 영역 */}
          <RCDWave
            volumeList={volumeList}
            isPlaying={isPlaying}
            recording={isRecording}
            isDone={isDone}
            elapsedTime={elapsedTime}
          />
          <FlexableMargin flexGrow={28} />
          <RCDTimer
            recording={isRecording}
            stop={stopRecording}
            type={type}
            onTimeUpdate={elapsedTime => setElapsedTime(elapsedTime)}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
          <FlexableMargin flexGrow={44} />

          <View className="w-full px-px">
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
          <FlexableMargin flexGrow={Platform.OS === 'ios' ? 79 : 55} />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <CustomText
            type="title1"
            text="듣고 있어요..."
            className="text-white"
          />
          <View className="h-[23]" />
          <CustomText
            type="body3"
            text={`세심한 확인이 필요할 때는\n시간이 조금 더 소요될 수 있어요`}
            className="text-gray200 text-center"
          />
          <View className="h-[54]" />
          <Spinner />
        </View>
      )}
    </BG>
  );
};
