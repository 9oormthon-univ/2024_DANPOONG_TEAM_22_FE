/**
 * 시간, 날짜 변환 관련 유틸리티 함수들 모음
 * 
 * 이 파일에는 시간 및 날짜 형식을 변환하는 다양한 유틸리티 함수들이 포함되어 있습니다.
 * 주로 한국어 시간 표기를 API에서 사용하는 형식으로 변환하거나,
 * 날짜 문자열을 다양한 형식으로 포맷팅하는 기능을 제공합니다.
 */



/**
 * 한국어 시간 표기를 API에서 사용하는 24시간 형식으로 변환하는 함수
 * @param hour - '오전/오후 HH시' 형식의 시간 문자열 (예: '오전 09시', '오후 03시')
 * @param minute - '00분' 형식의 분 문자열 (예: '30분')
 * @returns 'HH:MM:00' 형식의 시간 문자열 (예: '09:30:00', '15:30:00')
 */
export const convertTimeFormat = (hour: string, minute: string): string => {
    // '오전/오후 HH시' 형식에서 24시간 형식으로 변환
    const ampm = hour.slice(0, 2);
    let hours = parseInt(hour.slice(3, -1));
    
    if (ampm === '오후' && hours !== 12) {
      hours += 12;
    } else if (ampm === '오전' && hours === 12) {
      hours = 0;
    }
    
    // '00분' 형식에서 숫자만 추출
    const minutes = minute.slice(0, -1);
    
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  };
  
  /**
 * 날짜 문자열을 한국어 형식으로 변환하는 유틸리티 함수
 * 설명: 이 함수는 날짜 문자열을 받아 'YYYY. MM. DD' 형식의 한국어 날짜 표기로 변환합니다.
 * 입력: @param {string} dateString - 변환할 날짜 문자열 (예: '2023-01-15T00:00:00.000Z')       
 * 출력: @returns {string} - 한국어 형식으로 변환된 날짜 문자열 (예: '2023. 01. 15')
 */
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const formattedDate = date.toLocaleDateString('ko-KR', options);
  
    return formattedDate;
  };
  
  /**
 * 날짜 객체를 'YYYY.MM.DD' 형식의 문자열로 변환합니다.
 * @param {Date} date - 변환할 날짜 객체
 * @returns {string} 'YYYY.MM.DD' 형식의 문자열 (예: '2023.05.21')
 */
export const formatDateDot = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}.${month}.${day}`;
  };
  