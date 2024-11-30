import {getHelperNum} from '@apis/member';
import {useQuery} from '@tanstack/react-query';

const useGetHelperNum = () => {
  return useQuery({queryKey: ['getHelperNum'], queryFn: () => getHelperNum()});
};

export default useGetHelperNum;
