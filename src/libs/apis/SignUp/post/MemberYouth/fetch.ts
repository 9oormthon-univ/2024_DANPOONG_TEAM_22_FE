import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import {
  type postMemberYouthRequest,
  type postMemberYouthResponse,
} from './type';

export const postMemberYouth = async (
  data: Readonly<postMemberYouthRequest>,
) => {
  const res = await client.post<ResultResponseData<postMemberYouthResponse>>(
    '/api/v1/member/youth',
    data,
  );

  return res.data;
};
