export type RootStackParamList = {
  AuthStackNav: undefined;
  AppTabNav: undefined;
  YouthStackNav: {
    screen: 'YouthListenScreen';
    params: { alarmId: number; script: string };
  };
};
