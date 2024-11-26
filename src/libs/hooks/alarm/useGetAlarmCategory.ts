import { getAlarmCategory } from '@apis/alarm';
import { useQuery } from '@tanstack/react-query';

const useGetAlarmCategory = () => {
  return useQuery({
    queryKey: ['getAlarmCategory'],
    queryFn: () => getAlarmCategory(),
  });
};

export default useGetAlarmCategory;
