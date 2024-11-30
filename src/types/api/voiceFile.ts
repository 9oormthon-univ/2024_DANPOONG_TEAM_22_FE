type VoiceFilesRequestData = {
  alarmId: number
}

type VoiceFileResponseData = {
  voiceFileId: number
  fileUrl: string
  providedFileId: number
}

export type { VoiceFilesRequestData, VoiceFileResponseData }
