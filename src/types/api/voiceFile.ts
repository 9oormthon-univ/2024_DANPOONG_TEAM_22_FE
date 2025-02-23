import {FileMemberResponseData} from '@type/api/member';

type VoiceFilesRequestData = {
  alarmId: number;
};

type VoiceFileResponseData = {
  voiceFileId: number;
  fileUrl: string;
  providedFileId: number;
  content: string;
  member: FileMemberResponseData;
};

export type {VoiceFileResponseData, VoiceFilesRequestData};
