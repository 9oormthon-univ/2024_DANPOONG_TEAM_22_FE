import { type AlarmType } from '@type/api/common';

export type AlarmComfortResponseData = AlarmData & {
  children: AlarmData[];
};

export type AlarmData = {
  title: string;
  categoryType: AlarmType;
  alarmCategory: string;
  alarmCategoryKoreanName: string;
};
