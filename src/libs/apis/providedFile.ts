import {client} from '@apis/client';
import {ResultResponseData} from '@type/api/common';
import {
  CommentRequestData,
  LettersRequestData,
  LettersResponseData,
  ReportRequestData,
  SummaryResponseData,
} from '@type/api/providedFile';

const postComment = async ({
  providedFileId,
  message,
}: Readonly<CommentRequestData>) => {
  const res = await client.post<ResultResponseData<boolean>>(
    `/api/v1/providedfile/${providedFileId}/comment`,
    {
      message,
    },
  );
  return res.data;
};

const deleteComment = async ({
  providedFileId,
  message,
}: Readonly<CommentRequestData>) => {
  const res = await client.delete<ResultResponseData<boolean>>(
    `/api/v1/providedfile/${providedFileId}/comment`,
    {
      data: {message},
    },
  );
  return res.data;
};

const getSummary = async () => {
  const res = await client.get<ResultResponseData<SummaryResponseData>>(
    '/api/v1/providedfile/summary',
  );
  return res.data;
};

const getLetters = async ({
  parentCategory,
  pageable,
}: Readonly<LettersRequestData>) => {
  const res = await client.get<ResultResponseData<LettersResponseData>>(
    parentCategory
      ? `/api/v1/providedfile/list?parentCategory=${parentCategory}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`
      : `/api/v1/providedfile/list?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`,
  );
  return res.data;
};

const postReport = async ({
  providedFileId,
  reason,
}: Readonly<ReportRequestData>) => {
  const res = await client.post<ResultResponseData<boolean>>(
    `/api/v1/${providedFileId}/report`,
    {
      reason,
    },
  );
  return res.data;
};

const deleteLetter = async ({
  providedFileId,
  reason,
}: Readonly<ReportRequestData>) => {
  const res = await client.delete<ResultResponseData<boolean>>(
    `/api/v1/${providedFileId}`,
    {data: {reason}},
  );
  return res.data;
};

export {
  deleteComment,
  deleteLetter,
  getLetters,
  getSummary,
  postComment,
  postReport,
};
