import analytics from '@react-native-firebase/analytics';

/**
 * Google Tag Manager(GTM)에 이벤트를 전송하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 Firebase Analytics를 통해 GTM으로 이벤트 데이터를 전송합니다.
 * 앱 내 사용자 행동 추적 및 분석에 사용됩니다.
 * 
 * 입력:
 * @param {string} eventName - 추적할 이벤트의 이름
 * @param {Record<string, any>} additionalParams - 이벤트와 함께 전송할 추가 매개변수 객체
 * 
 * 출력:
 * @returns {Promise<void>} - 비동기 작업 완료를 나타내는 Promise
 */
export const trackGtmEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  try {
    await analytics().logEvent(eventName, additionalParams);
    console.log(`GTM Event logged: ${eventName}`);
  } catch (error) {
    console.error('Error logging GTM event:', error);
  }
};
