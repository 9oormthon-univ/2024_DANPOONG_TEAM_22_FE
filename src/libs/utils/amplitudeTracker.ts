/**
 * Amplitude 이벤트 추적 유틸리티
 * 
 * 설명:
 * 이 함수는 사용자 행동 및 앱 이벤트를 Amplitude 분석 플랫폼에 전송합니다.
 * 이벤트 이름과 추가 파라미터를 받아 Amplitude에 로깅하고 콘솔에도 기록합니다.
 * 
 * 입력:
 * @param {string} eventName - 추적할 이벤트 이름
 * @param {Record<string, any>} additionalParams - 이벤트와 함께 전송할 추가 데이터 (기본값: {})
 * 
 * 출력: 없음 (사이드 이펙트: Amplitude에 이벤트 전송)
 */
import * as amplitude from '@amplitude/analytics-react-native';

// Amplitude에 이벤트 로그 전송
export const trackAmplitudeEvent = async (
  eventName: string,
  additionalParams: Record<string, any> = {},
) => {
  amplitude.track(eventName, additionalParams);
  console.log(`Amplitude Event logged: ${eventName}`);
};
