import { ResultResponseData } from "@type/api/common";
export type VoicefilesGptByAlarmIdResponse =ResultResponseData<{
    voiceFileId: number;
      process: string;
      content: string;
    }>
  