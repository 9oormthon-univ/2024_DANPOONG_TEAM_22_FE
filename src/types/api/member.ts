type Gender = 'MALE' | 'FEMALE';

type Role = 'ADMIN' | 'YOUTH' | 'HELPER';

type MemberRequestData = {
  name: string;
  gender: Gender;
  profileImage: string;
  role: Role;
  birth: string;
  fcmToken: string;
};

type YouthRequestData = {
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  latitude: number;
  longitude: number;
};

type MemberResponseData = {memberId: number};

type MemberInfoResponseData = MemberRequestData & {
  youthMemberInfoDto: YouthRequestData;
};

type HelperNumResponseData = {
  youthMemberNum: number;
};

export type {
  Gender,
  HelperNumResponseData,
  MemberInfoResponseData,
  MemberRequestData,
  MemberResponseData,
  Role,
  YouthRequestData,
};
