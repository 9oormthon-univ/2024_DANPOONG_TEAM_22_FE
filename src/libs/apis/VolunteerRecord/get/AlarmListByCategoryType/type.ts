import { ResultResponseData } from '@type/api/common';
export type AlarmListByCategoryTypeResponse =ResultResponseData<AlarmListByCategoryTypeType[]>
  export type AlarmListByCategoryTypeType ={
    alarmCategory: string;
    koreanName: string;
    title: string;
    children: string[];
    used: boolean;
  }