import { RCD } from "@apis/RCDApis/getRCDList";
import { PostAskGPTResponse } from "@apis/RCDApis/postAskGPT";
export type HomeStackParamList = {
    Home: undefined;
    RCDList: {type: 'DAILY' | 'COMFORT'};
    RCDNotice: {type: 'DAILY' | 'COMFORT',item:RCD};
    RCDSelectText:{type: 'DAILY' | 'COMFORT',item:RCD};
    RCDText: {type: 'DAILY' | 'COMFORT',item:RCD,gptRes:PostAskGPTResponse|null,alarmId:number};
    RCDRecord: {type: 'DAILY' | 'COMFORT',item:RCD,gptRes:PostAskGPTResponse|null,alarmId:number,voiceFileId:number,content:string};
    RCDFeedBack: undefined;
    RCDError: {type: 'bad' | 'noisy' | 'server'};
  };