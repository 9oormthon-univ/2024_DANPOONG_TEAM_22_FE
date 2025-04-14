import { type AlarmType } from '@type/api/common';

export type getAlarmAlarmCategoryResponse = {
  title: string;
  categoryType: AlarmType;
  alarmCategory: string;
  alarmCategoryKoreanName: string;
};
