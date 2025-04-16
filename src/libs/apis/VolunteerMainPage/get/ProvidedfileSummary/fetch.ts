import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import { type getProvidedfileSummaryResponse } from './type';

export const getProvidedfileSummary = async (): Promise<
  ResultResponseData<getProvidedfileSummaryResponse>
> => {
  const res = await client.get<
    ResultResponseData<getProvidedfileSummaryResponse>
  >('/api/v1/providedfile/summary');

  return res.data;
};
