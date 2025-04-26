import { NativeModules } from 'react-native';

/** iOS 전용 WavRecorder 네이티브 모듈 */
const { WavRecorder } = NativeModules;

// WavRecorder가 addListener, removeListeners 제공하지 않으면 Dummy 메서드로 채워줍니다.
if (WavRecorder && !WavRecorder.addListener) {
  WavRecorder.addListener = () => {};
}

if (WavRecorder && !WavRecorder.removeListeners) {
  WavRecorder.removeListeners = () => {};
}

/**
 * 마이크 권한 상태를 확인합니다.
 * @returns 권한이 있으면 true, 없으면 false
 */
export async function checkMicrophonePermissionIOS(): Promise<boolean> {
  try {
    const hasPermission = await WavRecorder.checkPermissionStatus();

    return hasPermission;
  } catch (error) {
    console.error('마이크 권한 확인 오류:', error);

    return false;
  }
}

/**
 * 마이크 권한을 요청합니다.
 * @returns 권한이 부여되면 true, 거부되면 false
 */
export async function requestMicrophonePermissionIOS(): Promise<boolean> {
  try {
    const granted = await WavRecorder.requestRecordAudioPermission();

    return granted;
  } catch (error) {
    console.error('마이크 권한 요청 오류:', error);

    return false;
  }
}

/** 녹음 시작 함수 */
export async function startRecordingIOS(): Promise<string | null> {
  try {
    // 마이크 권한 확인
    const hasPermission = await checkMicrophonePermissionIOS();

    // 권한이 없는 경우 권한 요청
    if (!hasPermission) {
      const granted = await requestMicrophonePermissionIOS();

      if (!granted) {
        console.log('마이크 권한이 거부되었습니다.');

        return null;
      }
    }

    const result = await WavRecorder.startRecording('recording.wav');

    console.log('녹음 시작 경로:', result);

    return result;
  } catch (error) {
    console.error('녹음 시작 오류:', error);

    return null;
  }
}

/**
 * 녹음 중지 함수
 * @returns 녹음 파일 경로
 */
export async function stopRecordingIOS(): Promise<string | null> {
  try {
    const filePath = await WavRecorder.stopRecording();

    console.log('녹음 파일 경로:', filePath);

    return filePath;
  } catch (error) {
    console.error('녹음 종료 오류:', error);

    return null;
  }
}

/** 녹음 파일 재생 함수 */
export async function playRecordingIOS(): Promise<unknown> {
  try {
    const result = await WavRecorder.playRecording();

    console.log(result);

    return result;
  } catch (error) {
    console.error('녹음 파일 재생 오류:', error);
  }
}

/** 모든 녹음 중지 함수 */
export async function stopEverythingIOS(): Promise<void> {
  try {
    // 녹음 중인 상태라면 녹음을 중지합니다.
    if (WavRecorder && typeof WavRecorder.stopRecording === 'function') {
      await WavRecorder.stopRecording();
    }

    // 재생 중인 상태라면 재생을 중지합니다.
    if (WavRecorder && typeof WavRecorder.stopPlaying === 'function') {
      await WavRecorder.stopPlaying();
    }

    // 필요에 따라 추가적인 메모리 해제 작업 등을 수행할 수 있습니다.
    console.log('모든 녹음 및 재생 인스턴스와 메모리가 종료되었습니다.');
  } catch (error) {
    console.error('녹음, 재생 인스턴스 종료 중 오류:', error);
  }
}

/** 현재 볼륨 레벨 반환 함수 */
export const getCurrentMeteringIOS = async (): Promise<number | undefined> => {
  try {
    const currentMetering = await WavRecorder.getCurrentMetering();

    return currentMetering;
  } catch (error) {
    console.error('볼륨 레벨 측정 오류:', error);

    return undefined;
  }
};
