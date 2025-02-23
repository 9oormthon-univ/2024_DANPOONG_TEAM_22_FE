import analytics from '@react-native-firebase/analytics';

// GTM에 이벤트 로그 전송
const trackGtmEvent = async (
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

export default trackGtmEvent;
