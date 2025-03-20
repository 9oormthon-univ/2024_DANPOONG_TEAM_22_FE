type AlarmType = 'DAILY' | 'COMFORT';

type AlarmData = {
  title: string;
  categoryType: AlarmType;
  alarmCategory: string;
  alarmCategoryKoreanName: string;
};

type AlarmComfortResponseData = AlarmData &{
  children: AlarmData[];
}

type AlarmCategoryRequestData = {
  alarmCategoryId: number;
};

type AlarmCategoryResponseData = {
  alarmId: number;
  title: string;
};

type AlarmCategoryDetailRequestData = {
  childrenAlarmCategory: string;
};

type AlarmCategoryDetailResponseData = {
  alarmId: number;
  alarmCategory: string;
  title: string;
};

export type {
  AlarmType,
  AlarmData,
  AlarmComfortResponseData,
  AlarmCategoryRequestData,
  AlarmCategoryResponseData,
  AlarmCategoryDetailRequestData,
  AlarmCategoryDetailResponseData,
};
