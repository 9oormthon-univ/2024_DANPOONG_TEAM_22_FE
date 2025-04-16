import { client } from '@apis/client';
import { type ResultResponseData } from '@type/api/common';

import {
  type postMemberRequestData,
  type postMemberResponseData,
} from './type';

export const postMember = async (data: Readonly<postMemberRequestData>) => {
  const res = await client.post<ResultResponseData<postMemberResponseData>>(
    '/api/v1/member',
    data,
  );

  return res.data;
};
