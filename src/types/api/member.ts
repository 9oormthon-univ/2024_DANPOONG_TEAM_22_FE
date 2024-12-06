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

type MemberResponseData = {memberId: number};

interface MemberInfoResponseData extends MemberRequestData {
  youthMemberInfoDto: {
    wakeUpTime: string;
    sleepTime: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

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
};
