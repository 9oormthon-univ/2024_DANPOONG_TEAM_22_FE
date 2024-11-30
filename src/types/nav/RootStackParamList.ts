export type RootStackParamList = {
  AuthStackNav: undefined;
  AppTabNav: undefined;
  YouthStackNav: {
    screen: 'YouthListenScreen' | 'YouthHomeScreen';
    params: {alarmId?: number; script?: string};
  };
};
