import {getMember} from '@apis/member';
import {useQuery} from '@tanstack/react-query';

export const useGetMember = (token: string | null) => {
  return useQuery({
    queryKey: ['getMember'],
    queryFn: () => getMember(),
    enabled: token !== null,
  });
};
