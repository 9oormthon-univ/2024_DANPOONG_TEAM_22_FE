type Gender = 'MALE' | 'FEMALE';

type Role = 'ADMIN' | 'YOUTH' | 'HELPER';

type MemberCommonRequestData = {
  name: string;
  gender: Gender;
  profileImage: string;
  role: Role;
  birth: string;
  fcmToken: string;
};

type MemberDetailRequestData = {
  youthMemberInfoDto: {
    wakeUpTime: string;
    sleepTime: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    latitude: number;
    longitude: number;
  };
};

interface MemberInfoResponseData
  extends MemberCommonRequestData,
    MemberDetailRequestData {}

type MemberResponseData = {memberId: number};

type HelperNumResponseData = {
  youthMemberNum: number;
};

export type {
  Gender,
  HelperNumResponseData,
  MemberCommonRequestData,
  MemberDetailRequestData,
  MemberInfoResponseData,
  MemberResponseData,
  Role,
};
