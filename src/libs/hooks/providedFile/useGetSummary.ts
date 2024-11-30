import {getSummary} from '@apis/providedFile';
import {useQuery} from '@tanstack/react-query';

const useGetSummary = () => {
  return useQuery({queryKey: ['getSummary'], queryFn: () => getSummary()});
};

export default useGetSummary;
