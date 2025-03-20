import {trackAmplitudeEvent} from '@utils/amplitudeTracker';
import {trackGtmEvent} from '@utils/gtmTracker';
import {getCommonParams} from '@utils/trackerUtils';

// 공통 이벤트 추적 함수
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

// 공통 이벤트 정의
const trackAppStart = () => {
  if (__DEV__) {
    console.log('trackAppStart');
    return;
  }

  trackEvent('app_start');
};

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
