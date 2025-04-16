import { getProvidedfileList } from '@apis/VolunteerMainPage/get/ProvidedfileList/fetch';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type LettersRequestData } from '@type/api/providedFile';

export const useGetLetters = ({
  parentCategory,
  pageable,
}: Readonly<LettersRequestData>) => {
  return useInfiniteQuery({
    queryKey: ['getLetters', parentCategory],
    queryFn: ({ pageParam }) =>
      getProvidedfileList({
        parentCategory,
        pageable: { ...pageable, page: pageParam },
      }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const currentPage = lastPage?.result.number;
      const totalPages = lastPage?.result.totalPages;

      return currentPage < totalPages - 1 ? currentPage + 1 : undefined; // 다음 페이지가 있으면 반환
    },
    enabled: !!pageable,
  });
};
