/**
 * 생년월일을 기준으로 만 나이를 계산하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 주어진 생년월일을 기준으로 현재 날짜에 따른 만 나이를 계산합니다.
 * 생일이 지나지 않은 경우 연도 차이에서 1을 뺀 값을 반환합니다.
 * 
 * 입력:
 * @param {Date} birthday - 나이를 계산할 생년월일 객체
 * 
 * 출력:
 * @returns {number} - 계산된 만 나이
 */
export const calculateAge = (birthday: Date) => {
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    return age - 1;
  }
  return age;
};
