type Gender = 'MALE' | 'FEMALE';

type Role = 'ADMIN' | 'YOUTH' | 'HELPER' | 'GUEST';

type MemberRequestData = {
  name: string;
  gender: Gender;
  profileImage: string;
  role: Role;
  birth: string;
  fcmToken: string;
};

type YouthRequestData = {
  latitude: number;
  longitude: number;
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

type MemberResponseData = {memberId: number};

type MemberInfoResponseData = MemberRequestData & {
  youthMemberInfoDto: YouthRequestData;
};

type HelperNumResponseData = {
  youthMemberNum: number;
};

type FileMemberResponseData = {
  id: number;
  name: string;
  profileImage: string;
};

export type {
  FileMemberResponseData,
  Gender,
  HelperNumResponseData,
  MemberInfoResponseData,
  MemberRequestData,
  MemberResponseData,
  Role,
  YouthRequestData,
};
