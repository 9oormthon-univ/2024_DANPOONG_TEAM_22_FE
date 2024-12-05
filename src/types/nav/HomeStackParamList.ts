import { RCD } from "@apis/RCDApis/getRCDList";
import { PostAskGPTResponse } from "@apis/RCDApis/postAskGPT";
import { RecordType } from "@type/RecordType";
export type HomeStackParamList = {
    Home: undefined;
    RCDList: {type: RecordType};
    RCDNotice: {type: RecordType,item:RCD};
    RCDSelectText:{type: RecordType,item:RCD};
    RCDText: {type: RecordType,item:RCD,gptRes:PostAskGPTResponse|null,alarmId:number};
    RCDRecord: {type: RecordType,voiceFileId:number,content:string};
    RCDFeedBack: undefined;
    RCDError: {type: 'bad' | 'noisy' | 'server'};
  };