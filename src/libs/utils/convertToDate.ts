const convertToDate = (hour: string, minute: string): Date => {
  const now = new Date();
  const isPM = hour.includes('오후');
  let hourValue = parseInt(hour.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

  // 오전 12시는 0으로 변환, 오후 12시는 그대로 12 유지
  if (hourValue === 12) {
    hourValue = isPM ? 12 : 0;
  } else {
    hourValue = isPM ? hourValue + 12 : hourValue;
  }

  const minuteValue = parseInt(minute.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

  // 현재 날짜에 시, 분을 설정한 Date 객체 생성
  now.setHours(hourValue, minuteValue, 0, 0);
  return now;
};

export default convertToDate;
