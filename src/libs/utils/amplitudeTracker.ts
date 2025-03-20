import * as amplitude from '@amplitude/analytics-react-native';

// Amplitude에 이벤트 로그 전송
export const trackAmplitudeEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  amplitude.track(eventName, additionalParams);
  console.log(`Amplitude Event logged: ${eventName}`);
};

