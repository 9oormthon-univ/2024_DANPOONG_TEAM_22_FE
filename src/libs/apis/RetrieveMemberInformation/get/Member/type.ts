import { Gender, Role, ResultResponseData } from "@type/api/common";

export type MemberRequestData = {
    name: string;
    gender: Gender;
    profileImage: string;
    role: Role;
    birth: string;
    fcmToken: string;
  };

  export type YouthRequestData = {
    latitude: number;
    longitude: number;
    wakeUpTime: string;
    sleepTime: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  export type getMemberResponse = ResultResponseData<Omit<MemberRequestData, 'name'> & {
    youthMemberInfoDto: YouthRequestData;
    nickname: string;
  }>