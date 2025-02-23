import {getLetters} from '@apis/providedFile';
import {useInfiniteQuery} from '@tanstack/react-query';
import {LettersRequestData} from '@type/api/providedFile';

const useGetLetters = ({
  parentCategory,
  pageable,
}: Readonly<LettersRequestData>) => {
  return useInfiniteQuery({
    queryKey: ['getLetters', parentCategory],
    queryFn: ({pageParam}) =>
      getLetters({parentCategory, pageable: {...pageable, page: pageParam}}),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const currentPage = lastPage?.result.number;
      const totalPages = lastPage?.result.totalPages;
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined; // 다음 페이지가 있으면 반환
    },
    enabled: !!pageable,
  });
};

export default useGetLetters;
