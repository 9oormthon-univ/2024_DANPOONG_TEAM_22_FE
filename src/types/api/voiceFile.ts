type VoiceFilesRequestData = {
  alarmId: number;
};

type VoiceFileResponseData = {
  voiceFileId: number;
  fileUrl: string;
  providedFileId: number;
  content: string;
  member: {
    id: number;
    name: string;
    profileImage: string;
  };
};

export type {VoiceFilesRequestData, VoiceFileResponseData};
