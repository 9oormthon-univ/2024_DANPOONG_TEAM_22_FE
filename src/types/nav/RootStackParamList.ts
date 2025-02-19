export type RootStackParamList = {
  AuthStackNav: undefined | {screen: 'YouthOnboardingScreen'};
  AppTabNav: undefined;
  YouthStackNav: {
    screen: 'YouthListenScreen' | 'YouthHomeScreen';
    params?: {alarmId?: number};
  };
};
