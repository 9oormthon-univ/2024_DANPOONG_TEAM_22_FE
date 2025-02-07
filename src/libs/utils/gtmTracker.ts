import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import encryptUserId from '@utils/encryptUserId';
import {Platform} from 'react-native';

// 공통 매개변수 생성 함수
const getCommonParams = async () => {
  try {
    const memberId = await AsyncStorage.getItem('memberId');
    const userId = memberId ?? 'guest'; // 실제 사용자 ID
    const hashedUserId = encryptUserId(userId);

    return {
      timestamp: new Date().toISOString(), // 공통 매개변수: 앱 시작 시간
      user_id: hashedUserId, // 공통 매개변수: 사용자 ID (SHA256 암호화)
      app_version: '1.0.0', // 공통 매개변수: 앱 버전
      platform: Platform.OS, // 공통 매개변수: 플랫폼 (iOS/Android)
    };
  } catch (error) {
    console.error('Error getting common params:', error);
    return {
      timestamp: new Date().toISOString(),
      user_id: 'guest', // 에러 발생 시 기본값
      app_version: '1.0.0',
      platform: Platform.OS,
    };
  }
};

// 이벤트 추적 함수
const trackEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  const commonParams = await getCommonParams();

  try {
    await analytics().logEvent(eventName, {
      ...commonParams, // 공통 매개변수
      ...additionalParams, // 추가 매개변수
    });
    console.log(`Event logged: ${eventName}`);
  } catch (error) {
    console.error('Error logging event:', error);
  }
};

// 앱 시작 이벤트 추적
const trackAppStart = () => {
  trackEvent('app_start');
};

// 버튼 클릭 이벤트 추적
const trackButtonClick = (buttonId: string, buttonText: string) => {
  trackEvent('button_click', {
    button_id: buttonId,
    button_text: buttonText,
  });
};

// 에러 발생 이벤트 추적
const trackError = (
  errorCode: string,
  errorMessage: string,
  screenName: string,
) => {
  trackEvent('error_occurred', {
    error_code: errorCode,
    error_message: errorMessage,
    screen_name: screenName,
  });
};

// 화면 전환 이벤트 추적
const trackScreenView = async (screenName: string) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
    console.log(`Screen View logged: ${screenName}`);
  } catch (error) {
    console.error('Error logging screen view:', error);
  }
};

export {trackAppStart, trackButtonClick, trackError, trackScreenView};
