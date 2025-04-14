export type AlarmCategory2 = 'WELCOME_REMINDER' | 'THANK_YOU_MESSAGE';

export type postAlarmSettingToggleHelperByNotificationTypeAndBoolRequest = {
  alarmCategory: AlarmCategory2;
  enabled: boolean;
};

export type postAlarmSettingToggleHelperByNotificationTypeAndBoolResponse = {
  code: string;
  message: string;
};
