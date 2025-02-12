import client from '@apis/client';
import {ResultResponseData} from '@type/api/common';
import {
  HelperNumResponseData,
  MemberCommonRequestData,
  MemberDetailRequestData,
  MemberInfoResponseData,
  MemberResponseData,
} from '@type/api/member';

const getHelperNum = async () => {
  const res = await client.get<ResultResponseData<HelperNumResponseData>>(
    '/api/v1/member/helper-num',
  );
  return res.data;
};

const postMember = async (
  data: Readonly<MemberCommonRequestData | MemberDetailRequestData>,
) => {
  const res = await client.post<ResultResponseData<MemberResponseData>>(
    '/api/v1/member',
    data,
  );
  return res.data;
};

const getMember = async () => {
  const res = await client.get<ResultResponseData<MemberInfoResponseData>>(
    '/api/v1/member',
  );
  return res.data;
};

export {getHelperNum, getMember, postMember};
