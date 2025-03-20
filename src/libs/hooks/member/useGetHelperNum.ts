import {getHelperNum} from '@apis/member';
import {useQuery} from '@tanstack/react-query';

export const useGetHelperNum = () => {
  return useQuery({queryKey: ['getHelperNum'], queryFn: () => getHelperNum()});
};
