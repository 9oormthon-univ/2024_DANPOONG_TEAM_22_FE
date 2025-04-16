import { client } from '@apis/client';

import { type getMemberResponse } from './type';

export const getMember = async () => {
  const res = await client.get<getMemberResponse>('/api/v1/member');

  return res.data;
};
