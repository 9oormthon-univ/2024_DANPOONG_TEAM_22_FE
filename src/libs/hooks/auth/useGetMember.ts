import {getMember} from '@apis/member';
import {useQuery} from '@tanstack/react-query';

const useGetMember = (token: string | null) => {
  return useQuery({
    queryKey: ['getMember'],
    queryFn: () => getMember(),
    enabled: token !== null,
  });
};

export default useGetMember;
