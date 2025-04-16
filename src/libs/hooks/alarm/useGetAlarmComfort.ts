import { getAlarmAlarmCategoryComport } from '@apis/YouthListenToVoice/get/AlarmAlarmCategoryComport/fetch';
import { useQuery } from '@tanstack/react-query';

export const useGetAlarmComfort = () => {
  return useQuery({
    queryKey: ['getAlarmComfort'],
    queryFn: () => getAlarmAlarmCategoryComport(),
  });
};
