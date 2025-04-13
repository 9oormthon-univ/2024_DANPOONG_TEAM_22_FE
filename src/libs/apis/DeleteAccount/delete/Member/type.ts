import { ResultResponseData } from "@type/api/common";

export type deleteMemberResponse = ResultResponseData<{
    memberId: number;
}>

export type deleteMemberRequest= {
  reasonList: string[];
}