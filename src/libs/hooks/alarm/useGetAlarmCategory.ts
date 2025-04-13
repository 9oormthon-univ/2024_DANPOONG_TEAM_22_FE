import {getAlarmAlarmCategory} from '@apis/VolunteerMainPage/get/AlarmAlarmCategory/fetch';
import {useQuery} from '@tanstack/react-query';

export const useGetAlarmCategory = () => {
  return useQuery({
    queryKey: ['getAlarmCategory'],
    queryFn: () => getAlarmAlarmCategory(),
  });
};