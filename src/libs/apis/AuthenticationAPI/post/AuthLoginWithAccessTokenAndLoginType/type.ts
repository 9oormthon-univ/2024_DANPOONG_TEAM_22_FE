import { type Role } from '@type/api/common';

export type postAuthLoginWithAccessTokenAndLoginTypeRequest = {
  accessToken: string;
  loginType: string;
};

export type postAuthLoginWithAccessTokenAndLoginTypeResponse = {
  memberId: number;
  accessToken: string;
  refreshToken: string;
  serviceMember: boolean;
  role: Role;
  infoRegistered: boolean;
  locationRegistered: boolean;
  pushTimeRegistered: boolean;
  nickname: string;
};
