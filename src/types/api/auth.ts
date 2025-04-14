import { type Role } from '@type/api/common';

type LoginRequestData = {
  accessToken: string;
  loginType: string;
};

type LoginResponseData = {
  memberId: number;
  accessToken: string;
  refreshToken: string;
  serviceMember: boolean;
  role: Role;
  infoRegistered: boolean;
  locationRegistered: boolean;
  pushTimeRegistered: boolean;
};

export type { LoginRequestData, LoginResponseData };
