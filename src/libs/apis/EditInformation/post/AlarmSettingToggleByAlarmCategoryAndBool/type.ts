export type AlarmCategory =
  | 'WAKE_UP'
  | 'GO_OUT'
  | 'MEAL_BREAKFAST'
  | 'MEAL_LUNCH'
  | 'MEAL_DINNER'
  | 'SLEEP';
export type PostAlarmSettingToggleByAlarmCategoryAndBoolRequest = {
  alarmCategory: AlarmCategory;
  enabled: boolean;
};

export type PostAlarmSettingToggleByAlarmCategoryAndBoolResponse = {
  code: string;
  message: string;
};
