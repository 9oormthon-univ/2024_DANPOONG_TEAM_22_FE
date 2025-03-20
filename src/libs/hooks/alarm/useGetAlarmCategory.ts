import {getAlarmCategory} from '@apis/alarm';
import {useQuery} from '@tanstack/react-query';

export const useGetAlarmCategory = () => {
  return useQuery({
    queryKey: ['getAlarmCategory'],
    queryFn: () => getAlarmCategory(),
  });
};