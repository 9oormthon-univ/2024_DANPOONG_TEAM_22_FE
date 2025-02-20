import {getLetters} from '@apis/providedFile';
import {useQuery} from '@tanstack/react-query';
import {LettersRequestData} from '@type/api/providedFile';

const useGetLetters = ({
  parentCategory,
  pageable,
}: Readonly<LettersRequestData>) => {
  return useQuery({
    queryKey: ['getLetters', parentCategory, pageable],
    queryFn: () => getLetters({parentCategory, pageable}),
    enabled: !!pageable,
  });
};

export default useGetLetters;
