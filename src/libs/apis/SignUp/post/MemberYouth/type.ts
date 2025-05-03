export type postMemberYouthRequest = {
  latitude: number | null;
  longitude: number | null;
  wakeUpTime: string;
  sleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};
export type postMemberYouthResponse = { memberId: number };
