import { postMemberYouth } from '@apis/SignUp/post/MemberYouth/fetch';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { type YouthRequestData } from '@type/api/member';

export const usePostYouth = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (data: YouthRequestData) => postMemberYouth(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getMember'] }),
    onError: error => console.log(error),
  });
};
