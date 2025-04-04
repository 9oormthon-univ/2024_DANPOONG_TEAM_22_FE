import { ResultResponseData } from "@type/api/common";

export type getAlarmAlarmCategoryDetailByChildrenAlarmCategoryResponse= ResultResponseData<{
      alarmId: number;
      alarmCategory: string;
      title: string;
    }>
  
  
  export type AlarmType= {
    alarmId: number;
    alarmCategory: string;
    title: string;
  }