import {getMember} from '@apis/RetrieveMemberInformation/get/Member/fetch';
import {useQuery} from '@tanstack/react-query';

export const useGetMember = (token: string | null) => {
  return useQuery({
    queryKey: ['getMember'],
      queryFn: () =>getMember(),
    enabled: token !== null,
  });
};
