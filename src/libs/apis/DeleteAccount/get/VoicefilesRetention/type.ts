import { ResultResponseData } from "@type/api/common";

export type getVoicefilesRetentionResponse= ResultResponseData<{
    voiceCount: number;
    thanksCount: number; 
    messageCount: number;
  }>