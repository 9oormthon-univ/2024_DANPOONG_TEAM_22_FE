export type postMemberYouthRequest = {
  latitude: number;
  longitude: number;
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};
export type postMemberYouthResponse = { memberId: number };
