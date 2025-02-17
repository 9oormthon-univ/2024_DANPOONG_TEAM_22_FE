// 오디오 녹음 관련 라이브러리 임포트
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AVModeIOSOption,
  } from 'react-native-audio-recorder-player';

  // 오디오 녹음 플레이어 인스턴스 생성
  const audioRecorderPlayer = new AudioRecorderPlayer();
  
  // 녹음 중지 함수 
 export const stopEverythingIOS = async ()=>{
    // 녹음 중지 
    await audioRecorderPlayer.stopRecorder();
    // 플레이어 중지 
    await audioRecorderPlayer.stopPlayer();
    // 녹음 리스너 제거 
    audioRecorderPlayer.removeRecordBackListener();
    // 플레이어 리스너 제거 
    audioRecorderPlayer.removePlayBackListener();
  }
  
  // 현재 볼륨 레벨 반환 함수
  export const getCurrentMeteringIOS = async (): Promise<number | undefined> => {
    let currentMetering: number | undefined;
    audioRecorderPlayer.addRecordBackListener(e => {
        currentMetering = e.currentMetering;
      });
      return currentMetering;
  };

  
  // 녹음 시작 함수 
 export const startRecordingIOS = async () => {
    try {
      const path = 'recording.mp4';
      try {
        const audioSet: AudioSet = {
          // IOS 
          AVModeIOS: AVModeIOSOption.measurement,          // IOS 녹음 모드 설정
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,// IOS 녹음 퀄리티 설정
          AVNumberOfChannelsKeyIOS: 2,          // IOS 채널 설정
          AVFormatIDKeyIOS: AVEncodingOption.wav,          // IOS 포맷 설정
        };

        const result = await audioRecorderPlayer.startRecorder(
          path,
          audioSet,
          true,
        );
        audioRecorderPlayer.setSubscriptionDuration(0.1);
        return result;
      } catch (e) {
        console.log('e', e);
        return null;
      }
    } catch (err) {
      console.log('Failed to start recording', err);
      return null;
    }
  };
 // 녹음 중지 함수 
 export const stopRecordingIOS = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    } catch (err) { 
      if(__DEV__)console.log('Failed to stop recording', err);
    }
  };

  // 녹음 파일 재생 함수 
  export const playSoundIOS = async (uri: string) => {
      try {
        await audioRecorderPlayer.startPlayer(uri);
        audioRecorderPlayer.addPlayBackListener(() => {});
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      } catch (err) {
        console.log('Failed to play sound', err);
      }
  };