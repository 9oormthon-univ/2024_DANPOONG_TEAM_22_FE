import {navigationRef} from 'App';

export const navigateToYouthListenScreen = ({
  alarmId,
}: Readonly<{alarmId: number}>) => {
  navigationRef.navigate('YouthStackNav', {
    screen: 'YouthListenScreen',
    params: {
      alarmId,
    },
  });
};
