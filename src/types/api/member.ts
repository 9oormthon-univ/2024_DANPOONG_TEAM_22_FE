import { Gender, Role } from "@type/api/common";
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

type MemberInfoResponseData = Omit<MemberRequestData, 'name'> & {
  youthMemberInfoDto: YouthRequestData;
  nickname: string;
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
