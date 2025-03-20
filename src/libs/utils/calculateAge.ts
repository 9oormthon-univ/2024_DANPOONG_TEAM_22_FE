// 만 나이 계산
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

