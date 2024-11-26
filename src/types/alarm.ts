type AlarmType = 'DAILY' | 'COMFORT';

type AlarmData = {
  id: number;
  name: string;
  title: string;
  categoryType: AlarmType;
};

interface AlarmComfortResponseData extends AlarmData {
  children: AlarmData[];
}

type AlarmCategoryRequestData = {
  alarmCategoryId: number;
};

type AlarmCategoryResponseData = {
  alarmId: number;
  title: string;
};

export type { AlarmType, AlarmData, AlarmComfortResponseData, AlarmCategoryRequestData, AlarmCategoryResponseData };
