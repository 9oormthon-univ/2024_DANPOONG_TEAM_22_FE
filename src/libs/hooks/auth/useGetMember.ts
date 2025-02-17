import {getMember} from '@apis/member';
import {useQuery} from '@tanstack/react-query';

const useGetMember = () => {
  return useQuery({queryKey: ['getMember'], queryFn: () => getMember()});
};

export default useGetMember;
