export const formatBirth = (birthday: string) => {
  const year = birthday.slice(0, 4);
  const month = birthday.slice(4, 6);
  const day = birthday.slice(6, 8);

  return new Date(`${year}-${month}-${day}`).toISOString();
};

