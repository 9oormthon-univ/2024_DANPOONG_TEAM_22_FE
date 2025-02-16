import {postYouth} from '@apis/member';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {YouthRequestData} from '@type/api/member';

const usePostYouth = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: YouthRequestData) => postYouth(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getMember']}),
    onError: error => console.log(error),
  });
};

export default usePostYouth;
