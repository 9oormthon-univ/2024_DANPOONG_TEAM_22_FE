import {getMemberHelperNum} from '@apis/RetrieveMemberInformation/get/MemberHelperNum/fetch';
import {useQuery} from '@tanstack/react-query';

export const useGetHelperNum = () => {
  return useQuery({queryKey: ['getHelperNum'], queryFn: () => getMemberHelperNum()});
};
