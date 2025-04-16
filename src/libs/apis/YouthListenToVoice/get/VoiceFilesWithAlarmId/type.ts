type FileMemberResponseData = {
  id: number;
  name: string;
  profileImage: string;
};

export type VoiceFilesRequestData = {
  alarmId: number;
};

export type VoiceFileResponseData = {
  voiceFileId: number;
  fileUrl: string;
  providedFileId: number;
  content: string;
  member: FileMemberResponseData;
};
