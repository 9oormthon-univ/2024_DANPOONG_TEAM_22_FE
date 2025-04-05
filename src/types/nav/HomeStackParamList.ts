import { AlarmListByCategoryTypeType } from "@apis/VolunteerRecord/get/AlarmListByCategoryType/type";
import { VoicefilesGptByAlarmIdResponse } from "@apis/VolunteerRecord/post/VoicefilesGptByAlarmId/type";
import { RecordType } from "@type/RecordType";
export type HomeStackParamList = {
    Home: undefined;
    RCDList: {type: RecordType};
    RCDNotice: {type: RecordType,item:AlarmListByCategoryTypeType};
    RCDSelectText:{type: RecordType,item:AlarmListByCategoryTypeType};
    RCDText: {type: RecordType,item:AlarmListByCategoryTypeType,gptRes:VoicefilesGptByAlarmIdResponse|null,alarmId:number};
    RCDRecord: {type: RecordType,voiceFileId:number,content:string};
    RCDError: {type: RecordType,errorType:RCDErrorType};
    RCDFeedBack: undefined;
  };


  type RCDErrorType = 'noisy' | 'bad'|'wrong'|'notsame'|'server';



  // 'text has not been read as it is' |// 텍스트를 그대로 읽지 않았습니다.
  // 'Include inappropriate content' |// 부적절한 내용이 포함되어 있습니다.
  // 'notAnalyzing'|// 분석 중이지 않습니다.
  // 'invalidScript' | // GPT: 올바르지 않은 스크립트입니다.
  // 'server'; // 서버 오류

//  code 200 but need to handle:
// 텍스트를 그대로 읽지 않았습니다.
// 부적절한 내용이 포함되어 있습니다.
// 분석 중이지 않습니다.
// GPT: 올바르지 않은 스크립트입니다.

// code 500 : server error
// 분석 중 에러가 발생하였습니다.
// 분석 결과 저장에 문제가 발생했습니다.
// GPT가 올바르지 않은 답변을 했습니다. 관리자에게 문의하세요.