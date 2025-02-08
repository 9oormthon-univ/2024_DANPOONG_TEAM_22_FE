import {default as trackAmplitudeEvent} from '@utils/amplitudeTracker';
import {default as trackGtmEvent} from '@utils/gtmTracker';
import getCommonParams from '@utils/trackerUtils';

// 공통 이벤트 추적 함수
const trackEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  // 공통 파라미터 처리
  const commonParams = await getCommonParams();

  // GTM과 Amplitude에 각각 이벤트를 전송
  trackGtmEvent(eventName, {...commonParams, ...additionalParams});
  trackAmplitudeEvent(eventName, {...commonParams, ...additionalParams});
};

// 공통 이벤트 정의
const trackAppStart = () => {
  trackEvent('app_start');
};

const trackButtonClick = ({
  buttonId,
  buttonText,
}: Readonly<{buttonId: string; buttonText: string}>) => {
  trackEvent('button_click', {
    button_id: buttonId,
    button_text: buttonText,
  });
};

const trackError = ({
  errorCode,
  errorMessage,
  screenName,
}: Readonly<{errorCode: string; errorMessage: string; screenName: string}>) => {
  trackEvent('error_occurred', {
    error_code: errorCode,
    error_message: errorMessage,
    screen_name: screenName,
  });
};

const trackScreenView = async ({
  screenName,
}: Readonly<{screenName: string}>) => {
  trackEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });
};

export {trackAppStart, trackButtonClick, trackError, trackScreenView};
