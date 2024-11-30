import {getAlarmComfort} from '@apis/alarm';
import {useQuery} from '@tanstack/react-query';

const useGetAlarmComfort = () => {
  return useQuery({
    queryKey: ['getAlarmComfort'],
    queryFn: () => getAlarmComfort(),
  });
};

export default useGetAlarmComfort;
