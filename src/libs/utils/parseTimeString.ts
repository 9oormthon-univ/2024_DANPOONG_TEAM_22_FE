/**
 * 시간 문자열을 시간과 분으로 변환하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 'HH:MM:SS' 형식의 시간 문자열을 시간과 분 값으로 분리합니다.
 * 
 * 입력:
 * @param {string} timeString - 'HH:MM:SS' 형식의 시간 문자열 (예: '09:30:00')
 * 
 * 출력:
 * @returns {{hour: number, minute: number}} - 시간과 분을 포함하는 객체
 */
export const parseTimeString = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return {
    hour: hours,
    minute: minutes
  };
};