export type VoicefilesSelfByAlarmIdRequest ={
    content: string;
  }
  
  export type VoicefilesSelfByAlarmIdResponse ={
    timestamp: string;
    code: string;
    message: string;
    result: {
      voiceFileId: number;
      process: string;
      content: string;
    }
  }

