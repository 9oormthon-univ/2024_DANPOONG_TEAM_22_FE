const extractNumberFromDateString = (hour: string, minute: string) => {
  const isPM = hour.includes('오후');
  let hourValue = parseInt(hour.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

  // 오전 12시는 0으로 변환, 오후 12시는 그대로 12 유지
  if (hourValue === 12) {
    hourValue = isPM ? 12 : 0;
  } else {
    hourValue = isPM ? hourValue + 12 : hourValue;
  }

  const minuteValue = parseInt(minute.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

  return {hourValue, minuteValue};
};

export const joinTime = (hour: string, minute: string) => {
  const {hourValue, minuteValue} = extractNumberFromDateString(hour, minute);

  // 시간과 분을 두 자리 숫자로 포맷팅
  const formattedHour = String(hourValue).padStart(2, '0');
  const formattedMinute = String(minuteValue).padStart(2, '0');
  const formattedSecond = '00'; // 초는 항상 00으로 설정

  return `${formattedHour}:${formattedMinute}:${formattedSecond}`;
};
