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
    RCDError: {type: RCDErrorType,message:string};
  };


  type RCDErrorType = 
  'text has not been read as it is' |// 텍스트를 그대로 읽지 않았습니다.
  'Include inappropriate content' |// 부적절한 내용이 포함되어 있습니다.
  'notAnalyzing'|// 분석 중이지 않습니다.
  'invalidScript' | // GPT: 올바르지 않은 스크립트입니다.
  'server'; // 서버 오류

//  code 200 but need to handle:
// 텍스트를 그대로 읽지 않았습니다.
// 부적절한 내용이 포함되어 있습니다.
// 분석 중이지 않습니다.
// GPT: 올바르지 않은 스크립트입니다.

// code 500 : server error
// 분석 중 에러가 발생하였습니다.
// 분석 결과 저장에 문제가 발생했습니다.
// GPT가 올바르지 않은 답변을 했습니다. 관리자에게 문의하세요.