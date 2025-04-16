import { client } from '@apis/client';

import { type getMemberHelperNumResponse } from './type';

export const getMemberHelperNum = async () => {
  const res = await client.get<getMemberHelperNumResponse>(
    '/api/v1/member/helper-num',
  );

  return res.data;
};
