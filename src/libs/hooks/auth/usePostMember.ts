import {postMember} from '@apis/member';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {MemberRequestData} from '@type/api/member';

export const usePostMember = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: MemberRequestData) => postMember(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getMember']}),
    onError: error => console.log(error),
  });
};
