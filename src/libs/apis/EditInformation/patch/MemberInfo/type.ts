import {
  type Gender,
  type ResultResponseData,
  type Role,
} from '@type/api/common';

export type patchMemberInfoRequest = {
  name: string;
  gender: Gender;
  profileImage: string;
  role: Role;
  birth: string;
  fcmToken: string;
};

export type patchMemberInfoResponse = ResultResponseData<{
  memberId: number;
}>;
