import { Gender, Role } from "@type/api/common";


export type postMemberRequestData = {
  name: string;
  gender: Gender;
  profileImage: string;
  role: Role;
  birth: string;
  fcmToken: string;
};
export type postMemberResponseData = {memberId: number};
