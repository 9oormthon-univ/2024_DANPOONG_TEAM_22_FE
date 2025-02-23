// 시간 문자열을 API 형식으로 변환하는 함수 추가
// 입력: '오전/오후 HH시' 형식의 시간 문자열과 '00분' 형식의 분 문자열
// 출력: 'HH:MM:00' 형식의 시간 문자열
const convertTimeFormat = (hour: string, minute: string): string => {
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

export default convertTimeFormat;