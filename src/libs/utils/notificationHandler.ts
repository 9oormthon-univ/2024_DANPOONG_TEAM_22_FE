import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';
import {RootStackParamList} from '@type/RootStackParamList';
import PushNotification from 'react-native-push-notification';

// 앱을 끈 상태에서 푸시 알림을 누르면 푸시 페이지로 이동하지 않는 문제
// 앱을 킨 상태에서 푸시 알림을 누르면 푸시 페이지로 이동함
export const configurePushNotifications = (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
) => {
  const navigateToYouthListenScreen = ({
    alarmId,
    script,
  }: Readonly<{alarmId: number; script: string}>) => {
    navigationRef.navigate('YouthStackNav', {
      screen: 'YouthListenScreen',
      params: {
        alarmId,
        script,
      },
    });
  };

  PushNotification.configure({
    onRegister: function (token: any) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification: any) {
      console.log('NOTIFICATION:', notification);
      const alarmId = notification.data.alarmId;
      console.log('alarmId', alarmId);
      if (alarmId && navigationRef && navigationRef.current) {
        console.log('navigate to PushScreen', alarmId);
        navigateToYouthListenScreen({
          alarmId: Number(alarmId),
          script: notification.body,
        });
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onAction: function (notification: any) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },

    onRegistrationError: function (err: Error) {
      console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,

    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'riders',
      channelName: '앱 전반',
      channelDescription: '앱 실행하는 알림',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created: boolean) =>
      console.log(`createChannel riders returned '${created}'`),
  );
};
