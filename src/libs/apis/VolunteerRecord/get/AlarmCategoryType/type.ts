import { type AlarmType, type ResultResponseData } from '@type/api/common';

export type getAlarmCategoryTypeResponse = ResultResponseData<
  {
    categoryType: AlarmType;
    koreanName: string;
  }[]
>;

export type AlarmCategoryType = {
  categoryType: AlarmType;
  koreanName: string;
};
