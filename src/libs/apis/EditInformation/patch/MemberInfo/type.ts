import { ResultResponseData } from "@type/api/common";
import { Gender, Role } from "@type/api/common";
export type patchMemberInfoRequest= {
    name: string;
    gender: Gender;
    profileImage: string;
    role: Role;
    birth: string;
    fcmToken: string;
  }
  
  export type patchMemberInfoResponse = ResultResponseData<{
      memberId: number;
    }>
  