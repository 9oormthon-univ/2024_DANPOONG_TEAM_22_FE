import { type ResultResponseData } from '@type/api/common';

export type patchMemberInfoYouthRequest = {
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  outgoingTime: string;
};

export type patchMemberInfoYouthResponse = ResultResponseData<{
  memberId: number;
}>;
