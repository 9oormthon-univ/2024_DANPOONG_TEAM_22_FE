import {getSummary} from '@apis/providedFile';
import {useQuery} from '@tanstack/react-query';

export const useGetSummary = () => {
  return useQuery({queryKey: ['getSummary'], queryFn: () => getSummary()});
};

