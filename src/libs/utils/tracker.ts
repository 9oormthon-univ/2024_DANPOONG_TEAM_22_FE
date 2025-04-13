/**
 * 이벤트 추적 관련 기능을 제공하는 모듈
 * 
 * 설명:
 * 이 모듈은 앱 내 이벤트 추적을 위한 함수들을 제공합니다.
 * GTM과 Amplitude를 통해 이벤트를 추적합니다.
 */

import {trackAmplitudeEvent} from '@utils/amplitudeTracker';
import {trackGtmEvent} from '@utils/gtmTracker';
import {getCommonParams} from '@utils/trackerUtils';

/**
 * 공통 이벤트 추적 함수
 * 
 * 입력:
 * @param {string} eventName - 추적할 이벤트 이름
 * @param {Record<string, any>} additionalParams - 추가 파라미터 객체
 * 
 * 출력:
 * @returns {Promise<void>} - 이벤트 추적 작업 완료 Promise
 */
const trackEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  // 공통 파라미터 처리
  const commonParams = await getCommonParams();

  // 개발 모드에서는 콘솔에 로그를 출력하고, 실제 로그는 쌓지 않음
  if (__DEV__) {
    console.log('trackEvent:', eventName, {
      ...commonParams,
      ...additionalParams,
    });
    return;
  }

  // GTM과 Amplitude에 각각 이벤트를 전송
  trackGtmEvent(eventName, {...commonParams, ...additionalParams});
  trackAmplitudeEvent(eventName, {...commonParams, ...additionalParams});
};

/**
 * 앱 시작 이벤트 추적 함수
 * 
 * 입력:
 * 없음
 * 
 * 출력:
 * @returns {void} - 반환값 없음
 */
const trackAppStart = () => {
  if (__DEV__) {
    console.log('trackAppStart');
    return;
  }

  trackEvent('app_start');
};

/**
 * 화면 조회 이벤트 추적 함수
 * 
 * 입력:
 * @param {object} params - 화면 정보 매개변수
 * @param {string} params.screenName - 추적할 화면 이름
 * 
 * 출력:
 * @returns {Promise<void>} - 이벤트 추적 작업 완료 Promise
 */
const trackScreenView = async ({
  screenName,
}: Readonly<{screenName: string}>) => {
  if (__DEV__) {
    console.log('trackScreenView:', screenName);
    return;
  }

  trackEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });
};

export {trackAppStart, trackEvent, trackScreenView};
