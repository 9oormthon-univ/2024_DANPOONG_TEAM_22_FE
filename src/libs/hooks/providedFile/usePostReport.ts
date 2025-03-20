import {postReport} from '@apis/providedFile';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {ReportRequestData} from '@type/api/providedFile';

export const usePostReport = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: ReportRequestData) => postReport(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getReport']}),
    onError: error => console.log(error),
  });
};
