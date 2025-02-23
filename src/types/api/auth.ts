import {Role} from '@type/api/member';

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

export type {LoginRequestData, LoginResponseData};
