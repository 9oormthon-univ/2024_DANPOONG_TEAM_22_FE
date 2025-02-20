import {deleteLetter} from '@apis/providedFile';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {ReportRequestData} from '@type/api/providedFile';

const useDeleteLetter = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: ReportRequestData) => deleteLetter(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getReport']}),
    onError: error => console.log(error),
  });
};

export default useDeleteLetter;
