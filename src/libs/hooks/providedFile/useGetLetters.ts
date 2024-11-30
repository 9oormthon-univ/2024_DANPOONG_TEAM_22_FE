import {getLetters} from '@apis/providedFile';
import {useQuery} from '@tanstack/react-query';
import {LettersRequestData} from '@type/api/providedFile';

const useGetLetters = ({
  parentCategoryId,
  pageable,
}: Readonly<LettersRequestData>) => {
  return useQuery({
    queryKey: ['getLetters', parentCategoryId, pageable],
    queryFn: () => getLetters({parentCategoryId, pageable}),
    enabled: !!parentCategoryId && !!pageable,
  });
};

export default useGetLetters;
