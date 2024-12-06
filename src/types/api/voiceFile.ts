type VoiceFilesRequestData = {
  alarmId: number;
};

type VoiceFileResponseData = {
  voiceFileId: number;
  fileUrl: string;
  providedFileId: number;
  content: string;
};

export type {VoiceFilesRequestData, VoiceFileResponseData};
