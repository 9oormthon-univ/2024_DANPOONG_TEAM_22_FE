import {deleteProvidedfileByProvidedFileId} from '@apis/VolunteerMainPage/delete/ProvidedfileByProvidedFileId/fetch';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {ReportRequestData} from '@type/api/providedFile';

export const useDeleteLetter = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: ReportRequestData) => deleteProvidedfileByProvidedFileId(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getReport']}),
    onError: error => console.log(error),
  });
};

