// YYYY. MM. DD
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formattedDate = date
    .toLocaleDateString('ko-KR', options)
    .replace(/\./g, '. ');

  return formattedDate;
};

export default formatDate;
