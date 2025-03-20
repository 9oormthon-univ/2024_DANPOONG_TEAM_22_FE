import {getAlarmComfort} from '@apis/alarm';
import {useQuery} from '@tanstack/react-query';

export const useGetAlarmComfort = () => {
  return useQuery({
    queryKey: ['getAlarmComfort'],
    queryFn: () => getAlarmComfort(),
  });
};
