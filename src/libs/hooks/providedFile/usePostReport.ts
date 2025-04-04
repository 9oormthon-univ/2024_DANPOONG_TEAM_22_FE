import {ProvidedfileReportByProvidedFileId} from '@apis/VolunteerMainPage/post/ProvidedfileReportByProvidedFileId/fetch';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {ReportRequestData} from '@type/api/providedFile';

export const usePostReport = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: ReportRequestData) => ProvidedfileReportByProvidedFileId(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getReport']}),
    onError: error => console.log(error),
  });
};
