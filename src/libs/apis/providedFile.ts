import client from '@apis/client';
import { ResultResponseData } from '@type/common';
import { CommentRequestData, LettersRequestData, LettersResponseData, SummaryResponseData } from '@type/providedFile';

const postComment = async ({ providedFileId, message }: Readonly<CommentRequestData>) => {
  const res = await client.post<ResultResponseData<boolean>>(`/api/v1/providedfile/${providedFileId}/comment`, {
    message,
  });
  return res.data;
};

const getSummary = async () => {
  const res = await client.get<ResultResponseData<SummaryResponseData>>(`/api/v1/providedfile/summary`);
  return res.data;
};

const getLetters = async ({ parentCategoryId, pageable }: Readonly<LettersRequestData>) => {
  const res = await client.get<ResultResponseData<LettersResponseData>>(
    `/api/v1/providedfile/list?parent_category_id=${parentCategoryId}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`
  );
  return res.data;
};

export { postComment, getSummary, getLetters };
