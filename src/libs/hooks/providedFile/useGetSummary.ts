import { getProvidedfileSummary } from '@apis/VolunteerMainPage/get/ProvidedfileSummary/fetch';
import { useQuery } from '@tanstack/react-query';

export const useGetSummary = () => {
  return useQuery({
    queryKey: ['getSummary'],
    queryFn: () => getProvidedfileSummary(),
  });
};
