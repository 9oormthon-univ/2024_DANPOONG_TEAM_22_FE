import {navigationRef} from 'App';

const navigateToYouthListenScreen = ({
  alarmId,
}: Readonly<{alarmId: number}>) => {
  navigationRef.navigate('YouthStackNav', {
    screen: 'YouthListenScreen',
    params: {
      alarmId,
    },
  });
};

export default navigateToYouthListenScreen;
