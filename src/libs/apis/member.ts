import client from '@apis/client';
import {ResultResponseData} from '@type/api/common';
import {
  HelperNumResponseData,
  MemberInfoResponseData,
  MemberRequestData,
  MemberResponseData,
} from '@type/api/member';

const getHelperNum = async () => {
  const res = await client.get<ResultResponseData<HelperNumResponseData>>(
    '/api/v1/member/helper-num',
  );
  return res.data;
};

const postMember = async ({
  name,
  gender,
  profileImage,
  role,
  birth,
  fcmToken,
}: Readonly<MemberRequestData>) => {
  const res = await client.post<ResultResponseData<MemberResponseData>>(
    '/api/v1/member',
    {
      name,
      gender,
      profileImage,
      role,
      birth,
      fcmToken,
    },
  );
  return res.data;
};

const postMemberYouth = async ({
  name,
  gender,
  profileImage,
  role,
  birth,
  fcmToken,
  youthMemberInfoDto: {wakeUpTime, sleepTime, breakfast, lunch, dinner},
}: Readonly<MemberInfoResponseData>) => {
  const res = await client.post<ResultResponseData<MemberResponseData>>(
    '/api/v1/member',
    {
      name,
      gender,
      profileImage,
      role,
      birth,
      fcmToken,
      youthMemberInfoDto: {wakeUpTime, sleepTime, breakfast, lunch, dinner},
    },
  );
  return res.data;
};

const getMember = async () => {
  const res = await client.get<ResultResponseData<MemberInfoResponseData>>(
    '/api/v1/member',
  );
  return res.data;
};

export {getHelperNum, postMember, postMemberYouth, getMember};
