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
  latitude: number;
  longitude: number;
  wakeUpTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  sleepTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  breakfast: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  lunch: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  dinner: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
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
