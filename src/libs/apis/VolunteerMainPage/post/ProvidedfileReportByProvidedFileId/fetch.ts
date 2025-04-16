import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import { type postProvidedfileReportByProvidedFileIdRequest } from './type';

export const postProvidedfileReportByProvidedFileId = async ({
  providedFileId,
  reason,
}: Readonly<postProvidedfileReportByProvidedFileIdRequest>) => {
  const res = await client.post<ResultResponseData<boolean>>(
    `/api/v1/${providedFileId}/report`,
    {
      reason,
    },
  );

  return res.data;
};
