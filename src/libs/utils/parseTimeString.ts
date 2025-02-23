// 시간 문자열을 시간과 분으로 변환하는 함수
   // 입력: 'HH:MM:00' 형식의 시간 문자열
   // 출력: { hour: number, minute: number }
   const parseTimeString = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return {
      hour: hours,
      minute: minutes
    };
  };

export default parseTimeString;